from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import mysql.connector
import os 

app = Flask(__name__, static_folder='public')
CORS(app)

#Ruta principal para servir el archivo HTML
@app.route('/')
def sever_index():
 return send_from_directory(app.static_folder,'index.html')

@app.route('/api/registros', methods=['POST'])
def guardar_registro():
 data = request.json
 nombre = data.get('Nombre')
 email = data.get('Email')

 if not nombre or not email:
   return jsonify({'error': 'Faltan datos'}), 400
 
 try:
    conn = mysql.connector.connect(
       host= 'localhost',
       user= 'A',  
       password= 'nara8900',
       database= 'FormularioDB',
    )
    cursor = conn.cursor()

    cursor.execute("INSERT INTO Registros (Nombre, Email) VALUES(%s, %s)", (nombre, email))
    conn.commit()

    insert_id = cursor.lastrowid

    #Hacer el cierre de la conexión
    cursor.close()
    conn.close()

    return jsonify({'message': 'Registro guardado', 'id': insert_id})
 except mysql.connector.Error as err:
   return jsonify({'error': str(err)}), 500
 
@app.route('/api/listar-registros', methods=['GET'])
def listar_resgistros():
 try:
    conn = mysql.connector.connect(
       host= 'localhost',
       user= 'A',  
       password= 'nara8900',
       database= 'FormularioDB',
    )
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Registros")
    resultados = cursor.fetchall()
    
    #Hacer el cierre de la conexión
    cursor.close()
    conn.close()

    return jsonify(resultados) 
 except mysql.connector.Error as err:
    return jsonify({'error': str(err)}), 500
 
@app.route('/<path:filename>')
def static_files(filename):
  return send_from_directory(app.static_folder, filename)

if __name__=='__main__':
  app.run(debug=True)
 
