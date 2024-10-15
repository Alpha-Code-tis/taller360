import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import './GenerarPlanilla.css';

// Función para obtener la fecha actual
const obtenerFechaActual = () => {
  const hoy = new Date();
  const dia = hoy.getDate().toString().padStart(2, '0');  // Asegura que el día tenga dos dígitos
  const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');  // Meses empiezan en 0
  const año = hoy.getFullYear();
  return `${año}/${mes}/${dia}`;
};

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionRow: {
    marginBottom: 10,
    flexDirection: 'row', 
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10, 
  },
  textRight: {
    marginLeft: 'auto', 
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f3f3f3',
  },
  label: {
    fontWeight: 'bold',
  }
});

// Componente para generar el PDF
const GenerarPlanilla = () => {
  const datos = [
    { tarea: 'Registrar docente', responsable: 'Juan Carlos Ortiz Ugarte', estado: 'En progreso', progreso: '40%' },
    { tarea: 'Visualizar planilla', responsable: 'Felipe Garcia Molina', estado: 'En progreso', progreso: '20%' },
    { tarea: 'Registrar equipo', responsable: 'Enrique Gomez Perez', estado: 'Pendiente', progreso: '0%' },
    { tarea: 'Autentificar usuarios', responsable: 'Juan Carlos Ortiz Ugarte', estado: 'Terminado', progreso: '100%' },
    { tarea: 'Registrar estudiantes', responsable: 'Felipe Gomez Perez', estado: 'Pendiente', progreso: '80%' },
  ];

  const PlanillaPDF = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Planilla de seguimiento</Text>
  
        {/* Coloca el equipo y la fecha en la misma fila */}
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Equipo: Alpha code</Text>
          <Text style={styles.textRight}>Fecha de generación: {obtenerFechaActual()}</Text>
        </View>
  
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.header]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Tarea</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Responsable</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Estado</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Progreso</Text>
            </View>
          </View>
  
          {datos.map((fila, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{fila.tarea}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{fila.responsable}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{fila.estado}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{fila.progreso}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div style={{ marginTop: '1px' }}>
      <h1>Generar Planilla</h1>

      {/* Vista previa del PDF */}
      <PDFViewer width="150%" height="1000">
        <PlanillaPDF />
      </PDFViewer>

      {/* Botón de descarga del PDF */}
      <PDFDownloadLink document={<PlanillaPDF />} fileName="planilla.pdf">
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default GenerarPlanilla;
