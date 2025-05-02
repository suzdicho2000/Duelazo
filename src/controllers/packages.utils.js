import { readPackages, findCell, dataCell } from '../services/google/utilsGoogle.js';

export async function getPackageByReference(planReferenceId) {
  try {
    const rows = await readPackages();
    if (rows === undefined) {
      console.log('No se encontraron datos en la hoja de cálculo.');
      return false;
    } else {
      const cellAdress = await findCell(rows, planReferenceId);
      if (cellAdress === false) {
        console.log('No se encontró la celda con el valor proporcionado.');
        return false;
      } else {
        const data = await dataCell(cellAdress);
        console.log(data);
        if (typeof data[0][1] !== 'string') return false;
        const normalized = data[0][1].replace(/,/g, '');
        const number = parseFloat(normalized);
        return isNaN(number) ? null : number;
      }
    }
  } catch (error) {
    console.error('error', error);
  }
}
