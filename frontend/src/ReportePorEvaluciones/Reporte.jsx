import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const Reporte = ({ data  }) => {
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');  // Asegura que el día tenga dos dígitos
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');  // Meses empiezan en 0
    const año = hoy.getFullYear();
    return `${año}/${mes}/${dia}`;
  };
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
      flexDirection: 'column',
    },
    label: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 10,
      lineHeight: 1.2
    },
    textRight: {
      marginLeft: 'auto',
      fontSize: 12,
      fontWeight: 'bold',
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
      overflow: 'hidden', // Esconde contenido desbordante
      wordWrap: 'break-word', // Divide palabras largas
      whiteSpace: 'pre-wrap', // Permitir ajustes
      textOverflow: 'clip', // Asegura que no se muestre fuera del límite
      // width: '0%', // Asegúrate de que el texto respete el contenedor
    },
    header: {
      fontWeight: 'bold',
      backgroundColor: '#f3f3f3',
    }
  });

  return (
    <Document>
      <Page style={styles.page} orientation='landscape'>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.sectionRow}>
          <Text style={styles.textRight}>Fecha de generación: {obtenerFechaActual()}</Text>
          <Text style={styles.label}>Evaluación: {data.evaluation}</Text>
          <Text style={styles.label}>Empresa: {data.empresa}</Text>
          {data.sprint && (<Text style={styles.label}>Sprint: {data.sprint}</Text>)}
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.header]}>
            {data.headers.map((header, index) => (
              <View style={styles.tableCol} key={index}>
                <Text style={styles.tableCell}>{header}</Text>
              </View>
            ))}
          </View>

          {data.rows.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              {row.map((col, index) => (
                <View key={index} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{col}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default Reporte;
