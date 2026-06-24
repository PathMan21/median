import {
  Injectable,
  OnModuleInit,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';

/** Sous-ensemble du fichier Multer dont on a besoin (évite la dépendance au type global Express.Multer). */
export interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

/**
 * Service d'upload de fichiers vers un stockage objet (Azure Blob / Azurite en local).
 * Compatible avec n'importe quel endpoint via STORAGE_CONNECTION_STRING (injecté
 * depuis Key Vault en production, depuis Azurite via docker-compose en local).
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private container: ContainerClient | null = null;
  private readonly containerName = process.env.STORAGE_CONTAINER ?? 'media';

  async onModuleInit(): Promise<void> {
    const connectionString = process.env.STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      this.logger.warn(
        'STORAGE_CONNECTION_STRING absent — les uploads Blob sont désactivés.',
      );
      return;
    }

    try {
      const service = BlobServiceClient.fromConnectionString(connectionString);
      this.container = service.getContainerClient(this.containerName);
      await this.container.createIfNotExists();
      this.logger.log(
        `Stockage Blob prêt (container "${this.containerName}").`,
      );
    } catch (err) {
      this.logger.error(`Échec init stockage Blob: ${(err as Error).message}`);
      this.container = null;
    }
  }

  isEnabled(): boolean {
    return this.container !== null;
  }

  /**
   * Upload un fichier et renvoie son URL publique.
   * @param file fichier reçu via Multer
   * @param prefix préfixe de chemin logique (ex: "films/12/")
   */
  async upload(file: UploadedFile, prefix = ''): Promise<string> {
    if (!this.container) {
      throw new ServiceUnavailableException('Stockage objet non configuré');
    }

    const ext = file.originalname.includes('.')
      ? file.originalname.split('.').pop()
      : 'bin';
    const blobName = `${prefix}${randomUUID()}.${ext}`;
    const blockBlob = this.container.getBlockBlobClient(blobName);

    await blockBlob.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return blockBlob.url;
  }
}
