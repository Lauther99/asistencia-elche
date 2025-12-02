export interface Workers {
  index: string,
  nombre: string,
  dni: string,
  role: string
}

export const workers: Workers[] = [
  { index: "001", nombre: "LUCIA BORRERO", dni: "46185432", role: "worker" },
  { index: "002", nombre: "DIANA IPANAQUE", dni: "03892121", role: "worker" },
  { index: "003", nombre: "RONALD ROMERO", dni: "47809277", role: "worker" },
  { index: "004", nombre: "JOSE VALLADARES", dni: "25729326", role: "worker" },
  { index: "005", nombre: "BRENDY CHERO", dni: "43857335", role: "worker" },
  { index: "006", nombre: "YOVANY RIVAS", dni: "03898576", role: "worker" },
  { index: "007", nombre: "JEANCARLO QUEREVALU", dni: "71538331", role: "worker" },
  { index: "admin1", nombre: "JOSE BENITES", dni: "88888888", role: "admin" },
  { index: "admin2", nombre: "LAUTHER VALLADARES", dni: "99999999", role: "admin" },
];
