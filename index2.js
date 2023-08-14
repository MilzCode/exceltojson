const XLSX = require('xlsx');
const fs = require('fs');

const fileName = 'index.xlsx';

const ValidarExtension = ({ fileName, extensiones }) => {
	const extension = fileName.split('.').pop();
	return extensiones.includes(extension);
};

const ReadExcelByRoute = (route = '', page = 0) => {
	const extensiones = ['xls', 'xlsx'];
	const validExt = ValidarExtension({
		fileName: route,
		extensiones,
	});
	if (!validExt) {
		console.log(
			`El archivo ${route} no es un archivo de Excel válido. Seleccione un archivo con extensión: ${extensiones.join(
				', '
			)}`
		);
		return null;
	}
	const workbook = XLSX.readFile(route);
	const sheetName = workbook.SheetNames[page];
	const sheet = workbook.Sheets[sheetName];
	const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Include header row
	return data;
};

const dataJson = ReadExcelByRoute(fileName);

// Extract header and data
const [header, ...rows] = dataJson;

const jsonDataWithHeaders = rows.map((row) =>
	Object.fromEntries(header.map((col, i) => [col, row[i]]))
);

// Create a new JSON file
const newJsonFile = JSON.stringify(jsonDataWithHeaders, null, 2); // Prettify JSON
const nameJsonFile = fileName.split('.')[0] + '.json';

fs.writeFile(nameJsonFile, newJsonFile, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`El archivo JSON "${nameJsonFile}" se ha creado exitosamente.`);
	}
});
