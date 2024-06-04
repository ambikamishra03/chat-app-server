// import grid from 'gridfs-stream';
// import mongoose from 'mongoose';
// const url = "http://localhost:8000";

// const conn =mongoose.connection;
// let gfs , gridFsBucket;
// conn.once('open',() =>{
//   gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
//    bucketName: 'fs'
//   });

//   gfs = grid(conn.db,mongoose.mongo);
//   gfs.collection('fs');
// })

// export const uploadFile = async (request, response) =>{
//  if(!request.file){
//     return response.status(404).json('file not found');
//  }
//  const imageUrl = `${url}/file/${request.file.filename}`;
//  return response.status(200).json(imageUrl);
// }


// export const getImage = async (request,response)=>{
// try {
//     const file = await gfs.files.findOne({filename: request.params.filename});

//     const readStream = gridFsBucket.openDownloadStream(file._id);

//     readStream.pipe(response);
// } catch (error) {
//      return response.status(500).json(error.message);
// }
// }

import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'http://localhost:8000';


let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});


export const uploadFile = (request, response) => {
    if(!request.file) 
        return response.status(404).json("File not found");
    
    // const imageUrl = `${url}/file/${request.file.filename}`;
    const encodedFilename = encodeURIComponent(request.file.filename);
    const imageUrl = `${url}/file/${encodedFilename}`;


    response.status(200).json(imageUrl);    
}

export const getImage = async (request, response) => {
    try {   
        // const file = await gfs.files.findOne({ filename: request.params.filename });
        const decodedFilename = decodeURIComponent(request.params.filename);
        const file = await gfs.files.findOne({ filename: decodedFilename });

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}