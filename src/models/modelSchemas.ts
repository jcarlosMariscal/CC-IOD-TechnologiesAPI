import Joi from "joi";
import {
  arrValuesValidation,
  dateValidation,
  emailValidation,
  fieldIdValidation,
  numberPositiveValidation,
  observationsValidation,
  passwordValidation,
  phoneValidation,
  roleIdValidation,
  statusValidation,
  stringValidation,
  timeValidation,
} from "../helpers/JOIValidations";

const name = { name: stringValidation() };
const email = { email: emailValidation };
const contact_numbers = { contact_numbers: arrValuesValidation("contacto") };
const relationship_id = {
  relationship_id: fieldIdValidation({
    field: "parentesco",
    allowedValues: [1, 2],
    allowedMsg: "Familiar o Abogado",
  }),
};

export const prospectSchema = Joi.object({
  ...name,
  ...email,
  phone: phoneValidation,
  ...relationship_id,
  status: statusValidation({
    allowedValues: ["Pendiente", "Aprobado"],
    field: "estado",
  }),
  date: dateValidation(),
  ...observationsValidation,
});

export const clientSchema = Joi.object({
  contract_number: numberPositiveValidation("número de contrato"),
  defendant_name: stringValidation("El nombre del imputado"),
  criminal_case: stringValidation("La causa penal"),
  investigation_file_number: numberPositiveValidation(
    "número de carpeta de investigación",
    true
  ),
  judge_name: stringValidation("El nombre del Juez"),
  court_name: stringValidation("El nombre del Juzgado"),
  lawyer_name: stringValidation("El nombre del Abogado"),
  signer_name: stringValidation("El nombre de quién firma el contrato"),
  ...contact_numbers,
  hearing_date: dateValidation("fecha de audiencia"),
  status: statusValidation({
    allowedValues: [
      "Pendiente de aprobación",
      "Pendiente de audiencia",
      "Pendiente de colocación",
      "Colocado",
    ],
    field: "estado",
  }),
  ...observationsValidation,
  prospect_id: fieldIdValidation({
    field: "prospecto",
    req: "Debe haber un prospecto a la cuál definir como cliente.",
  }),
});

export const carrierSchema = Joi.object({
  residence_area: stringValidation("La Zona de residencia"),
  placement_date: dateValidation("fecha de colocación"),
  placement_time: timeValidation,
  electronic_bracelet: stringValidation("El brazalete electrónico"),
  beacon: stringValidation("El BEACON"),
  wireless_charger: stringValidation("El cargador inalámbrico"),
  information_emails: arrValuesValidation("email"),
  ...contact_numbers,
  house_arrest: stringValidation("El arraigo domiciliario"),
  installer_name: stringValidation("El nombre del instalador"),
  ...observationsValidation,
  client_id: fieldIdValidation({
    field: "cliente",
    req: "Debe haber un cliente a la cuál definir como portador.",
  }),
  ...relationship_id,
});

// --------------- AUTH ------------------------------

export const registerSchema = Joi.object({
  ...name,
  ...roleIdValidation,
  ...email,
  ...passwordValidation,
});
export const updateUserSchema = Joi.object({
  ...name,
  ...roleIdValidation,
  ...email,
});
export const updateAdminSchema = Joi.object({ ...name });
export const loginSchema = Joi.object({ ...email, ...passwordValidation });
export const changePassSchema = Joi.object({ ...passwordValidation });
export const emailSchema = Joi.object({ ...email });
// 107
