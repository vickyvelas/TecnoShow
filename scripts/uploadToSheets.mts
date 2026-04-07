import { google } from "googleapis";
import fs from "fs";

// 🔑 Cargar credenciales
const auth = new google.auth.GoogleAuth({
  keyFile: "./scripts/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// 📄 ID de tu Google Sheet (el tuyo)
const SPREADSHEET_ID = "1JkdHHbBojA0vDSJO4zkQVbrexuAQKFKWfBPeisP25l4";

// 📥 Leer productos desde tu JSON (el que generaste)
const productos = JSON.parse(fs.readFileSync("./scripts/productos.json", "utf-8"));

async function subirProductos() {
  const client = await auth.getClient();

  const values = productos.map((p: any) => [
    p.sku || "",
  p.nombre || "",
  p.precio || "",
  p.marca || "",
  p.categoria || "",
  p.subcategoria || "",
  p.stock || "",
  (p.imagenes || []).join(","), // 🔥 importante separadas con comas
  p.descripcion || ""
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "productos", // cambiá si tu hoja se llama distinto
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });

  console.log("✅ Productos subidos a Google Sheets");
}

subirProductos();