
const multer = require("multer");
const Sequelize = require("../db.connection");
const Document = require("../models/document.model.js")(Sequelize.connection, Sequelize.library);
const sessions = require("./session.js");
const file = require("./file.js");
const e = require("express");

exports.addDocument = async (req, res) => {


	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Create document
		
		let document = await Document.create({
			id_client: client.id_client,
			nom_document: "test"
		});
		

		// File 
		//let file = req.file;
		// Upload file
		await file.uploadFile(req, res);
	}	
}

exports.deleteDocument = async (req, res) => {
	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Delete document
		let document = await Document.destroy({
			where: {
				id_document: req.params.id_document,
				id_client: client.id_client
			}
		});

		// Delete file
		//await file.deleteFile(document.id_document);

		res.status(200).send({ message: "Document deleted successfully" });
	}
}

exports.getAllDocuments = async (req, res) => {
	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Get all documents
		let documents = await Document.findAll({
			where: {
				id_client: client.id_client
			}
		});
		res.status(200).send(documents);
	}
}

exports.getSingleDocument = async (req, res) => {
	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Get document
		let document = await Document.findOne({
			where: {
				id_document: req.params.id_document,
				id_client: client.id_client
			}
		});
		res.status(200).send(document);
	}
}

exports.updateDocument = async (req, res) => {
	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Update document
		let document = await Document.update({
			nom_document: req.body.nom_document
		}, {
			where: {
				id_document: req.params.id_document,
				id_client: client.id_client
			}
		});

		// Upload file
		//await file.uploadFile(req.file.path, document.id_document);

		res.status(200).send({ message: "Document updated successfully" });
	}
}

exports.deleteAllDocuments = async (req, res) => {
	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Delete all documents
		let documents = await Document.destroy({
			where: {
				id_client: client.id_client
			}
		});

		// Delete all files
		//await file.deleteAllFiles();

		res.status(200).send({ message: "All documents deleted successfully" });
	}
}

exports.downloadDocument = async (req, res) => {

	// Get Client Id from token
	var token = req.get("Authorization");

	// Verify if user is logged in
	let session = await sessions.verifyToken(token, "client");

	if (!session) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	} else {
		// Get Client Id
		let client = await sessions.findByToken(token, "client");

		// Get document
		let document = await Document.findOne({
			where: {
				id_document: req.params.id_document,
				id_client: client.id_client
			}
		});

		// Download file
		//await file.downloadFile(document.id_document, res);
	}
}



