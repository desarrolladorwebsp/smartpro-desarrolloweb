export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  company: string;
  project: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,18}$/;

export function validateContactPayload(input: ContactPayload): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const project = input.project.trim();

  if (name.length < 3) {
    errors.name = "Ingresa tu nombre completo.";
  }

  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Ingresa un teléfono o WhatsApp válido.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (project.length < 12) {
    errors.project = "Cuéntanos un poco más sobre tu proyecto.";
  }

  return errors;
}

export function buildContactWhatsAppMessage(input: ContactPayload) {
  const lines = [
    "Hola SmartPro, quiero conversar sobre un proyecto de desarrollo web.",
    `Nombre: ${input.name.trim()}`,
    `Teléfono: ${input.phone.trim()}`,
    `Correo: ${input.email.trim()}`,
  ];

  if (input.company.trim()) {
    lines.push(`Empresa: ${input.company.trim()}`);
  }

  lines.push(`Proyecto: ${input.project.trim()}`);

  return lines.join("\n");
}
