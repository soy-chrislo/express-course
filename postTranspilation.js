import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Ruta de la carpeta ./dist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");

// Contador de archivos modificados
let modifiedFilesCount = 0;

/**
 * Agregar la extensión .js a las importaciones en un archivo
 * ./sum -> ./sum.js
 * ./sum.js -> ./sum.js.js (Corregir)
 * express -> express
 */
const addJsExtensionToImports = async (filePath) => {
	const fileContent = await fs.readFile(filePath, "utf-8");
	const updatedContent = fileContent.replace(
		/(import\s+.*?['"])(\.\/.*?)(?<!\.js)(['"])/g,
		"$1$2.js$3",
	);

	if (fileContent !== updatedContent) {
		await fs.writeFile(filePath, updatedContent, "utf-8");
		modifiedFilesCount++;
	}
};

// Función recursiva para procesar archivos en carpetas
const processDirectory = async (dir) => {
	const files = await fs.readdir(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stats = await fs.stat(filePath);

		if (stats.isDirectory()) {
			// Si es una carpeta, procesarla recursivamente
			await processDirectory(filePath);
		} else if (stats.isFile() && file.endsWith(".js")) {
			// Si es un archivo .js, procesa sus imports
			await addJsExtensionToImports(filePath);
		}
	}
};

(async () => {
	try {
		await processDirectory(distDir);
		console.log(
			`Se han actualizado las importaciones en ${modifiedFilesCount} archivos .js`,
		);
	} catch (err) {
		console.error("Error procesando la carpeta:", err);
	}
})();
