import { Observable } from 'rxjs';
import { TradeItem, CryptoToTrade } from '../../models/crypto-info';

export abstract class PortfolioRepository {

  /** Récupérer tous les trades d’un utilisateur */
  abstract getTradesByUser(userId: string): Observable<TradeItem[]>;

  /** Ajouter un trade BUY / SELL */
  abstract addTrade(trade: TradeItem): Promise<void>;

  /** Préparer une crypto à trader */
  abstract selectCryptoToTrade(data: CryptoToTrade): Promise<void>;
}
