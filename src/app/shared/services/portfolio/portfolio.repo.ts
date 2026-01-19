import { Observable } from 'rxjs';
import { CryptoToTrade } from '../../models/crypto-info';
import { Trade } from '../../models/trade';

export abstract class PortfolioRepository {

  /** Récupérer tous les trades d’un utilisateur */
  abstract getTradesByUser(userId: string): Observable<Trade[]>;

  /** Ajouter un trade BUY / SELL */
  abstract addTrade(trade: Trade): Promise<void>;

  /** Préparer une crypto à trader */
  abstract selectCryptoToTrade(data: CryptoToTrade): Promise<void>;
}
