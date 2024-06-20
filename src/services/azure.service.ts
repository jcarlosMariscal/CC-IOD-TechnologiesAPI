import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { IAzureUpload } from "../models/azure.interface";

const AZURE_KEY = process.env.AZURE_STORAGE_CONNECTION_STRING;
type TResponse = {
  success: boolean;
  message: string;
};

const getBlockBlobClient = (
  containerName: string,
  blobName: string
): BlockBlobClient => {
  if (!AZURE_KEY) throw new Error("Hay un error en la llave de autorización");

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_KEY);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  return containerClient.getBlockBlobClient(blobName);
};

export const azureUploadBlob = async ({
  blob,
  containerName,
}: IAzureUpload): Promise<TResponse> => {
  try {
    const blobName = blob!.originalname;
    const blockBlobClient = getBlockBlobClient(containerName, blobName);
    const exists = await blockBlobClient.exists();
    if (exists) {
      return {
        success: false,
        message: `Ya existe el archivo ${blobName} en el contenedor ${containerName}.`,
      };
    } else {
      await blockBlobClient.upload(blob!.buffer, blob!.size);
      return { success: true, message: blockBlobClient.url };
    }
  } catch (error) {
    return { success: false, message: "Ocurrió un error al subir el archivo." };
  }
};

export const azureDeleteBlob = async ({
  blobname,
  containerName,
}: IAzureUpload): Promise<TResponse> => {
  try {
    const blockBlobClient = getBlockBlobClient(containerName, blobname!);
    await blockBlobClient.delete();

    return { success: true, message: "El archivo se ha eliminado." };
  } catch (error) {
    return { success: false, message: "No se pudo eliminar el archivo" };
  }
};
