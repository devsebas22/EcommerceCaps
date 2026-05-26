import os
import uuid
from datetime import datetime, timedelta

import resend
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.password_reset import PasswordResetToken
from app.models.usuario import Usuario

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    nueva_password: str


@router.post("/forgot-password")
def forgot_password(datos: ForgotPasswordRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    _resp = {"mensaje": "Si el correo existe, recibirás un enlace de recuperación"}
    if not usuario:
        return _resp

    # Invalidar tokens anteriores no usados
    db.query(PasswordResetToken).filter(
        PasswordResetToken.usuario_id == usuario.id,
        not PasswordResetToken.used,
    ).update({"used": True})

    token = str(uuid.uuid4())
    reset_token = PasswordResetToken(
        usuario_id=usuario.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1),
    )
    db.add(reset_token)
    db.commit()

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8000")
    print(f"[auth_recovery] FRONTEND_URL={frontend_url!r}")
    link = f"{frontend_url}/reset-password?token={token}"
    from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    try:
        resend.api_key = os.getenv("RESEND_API_KEY", "")
        resend.Emails.send({
            "from": f"CapsCo <{from_email}>",
            "to": [usuario.email],
            "subject": "Recuperar contraseña — CapsCo",
            "html": f"""
            <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;">
              <p style="font-weight:800;font-size:0.85rem;letter-spacing:2px;color:#1D1D1F;margin-bottom:24px;">CAPSCO</p>
              <h2 style="color:#1D1D1F;font-size:1.3rem;margin:0 0 12px;">Recuperar contraseña</h2>
              <p style="color:#6E6E73;margin:0 0 28px;line-height:1.6;">
                Hola {usuario.nombre.split()[0]}, haz clic en el botón para restablecer tu contraseña.
                Este enlace expira en <strong>1 hora</strong>.
              </p>
              <a href="{link}"
                style="display:inline-block;background:#1D1D1F;color:#FFFFFF;padding:13px 28px;
                       border-radius:10px;text-decoration:none;font-weight:600;font-size:0.9rem;">
                Restablecer contraseña
              </a>
              <p style="color:#AEAEB2;font-size:0.78rem;margin-top:36px;">
                Si no solicitaste esto, puedes ignorar este correo.
              </p>
            </div>
            """,
        })
    except Exception as e:
        print(f"ERROR RESEND: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reset-password")
def reset_password(datos: ResetPasswordRequest, db: Session = Depends(get_db)):
    record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == datos.token,
        not PasswordResetToken.used,
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Token inválido o ya utilizado")
    if datetime.utcnow() > record.expires_at:
        raise HTTPException(status_code=400, detail="El token ha expirado")
    if len(datos.nueva_password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")

    usuario = db.query(Usuario).filter(Usuario.id == record.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.password = pwd_context.hash(datos.nueva_password)
    record.used = True
    db.commit()

    return {"mensaje": "Contraseña actualizada correctamente"}
