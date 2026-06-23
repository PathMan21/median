import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { connect, NatsConnection, JSONCodec } from 'nats';

/**
 * Bus de messages (NATS) pour les traitements asynchrones / découplage.
 * Optionnel : si NATS_URL est absent ou le broker indisponible, l'app continue
 * de fonctionner (les events sont simplement ignorés).
 */
@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsService.name);
  private nc: NatsConnection | null = null;
  private readonly codec = JSONCodec();

  async onModuleInit(): Promise<void> {
    const url = process.env.NATS_URL;
    if (!url) {
      this.logger.warn('NATS_URL absent — bus de messages désactivé.');
      return;
    }

    try {
      this.nc = await connect({ servers: url });
      this.logger.log(`Connecté à NATS (${url}).`);
      this.subscribe();
    } catch (err) {
      this.logger.error(`Connexion NATS échouée: ${(err as Error).message}`);
      this.nc = null;
    }
  }

  /** Consommateur : tâches asynchrones déclenchées par les inscriptions (stats...). */
  private subscribe(): void {
    if (!this.nc) return;
    const sub = this.nc.subscribe('user.registered');
    void (async () => {
      for await (const msg of sub) {
        const data = this.codec.decode(msg.data) as { login: string; email: string };
        this.logger.log(
          `[stats] Nouvel utilisateur inscrit: ${data.login} (${data.email})`,
        );
        // Point d'extension : incrément de compteurs, indexation, webhook, etc.
      }
    })().catch((err) => this.logger.error(err));
  }

  /** Producteur (best-effort). */
  publish(subject: string, data: unknown): void {
    if (!this.nc) return;
    try {
      this.nc.publish(subject, this.codec.encode(data));
    } catch (err) {
      this.logger.error(`Publish "${subject}" échoué: ${(err as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.nc) {
      await this.nc.drain();
    }
  }
}
