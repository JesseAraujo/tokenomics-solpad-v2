export class Presale {
  //inputs
  TotalSupply: number;
  Hardcap: number;
  PresalePrice: number;
  ListingPrice: number;
  LiquidityPercentage: number;

  //Initial Market Cap
  Mcap: number;

  //Price at launch
  SolPricePerToken: number;

  //Transfer fee
  TransferFee: number;

  //Check if it works or not
  IsWork: number;

  //Percentage you will use of the total supply
  YouWillUseHowManyTotalSupply: number;

  //Total tokens needed to create a SolPad Pool
  TotalTokensNeeded: number;

  //Total Tokens for PreSale
  TotalTokensForPresale: number;

  //Soft Cap
  SoftCap: number;

  //Total Tokens for Liquidity
  TotalTokensForLiquidity: number;

  //Token fee
  TokenFee: number;

  //Total $SOL going to the Owner Wallet
  TotalSolOwnerWallet: number;

  //Total $SOL for liquidity
  TotalSolForLiquidity: number;

  TotalTokensNeededOnePercentageSolpad: number;
  TokensForSolPad: number;

  ListTokenomics: Tokenomics[];

  constructor() {
    //this.TotalSupply = 0;
    //this.Hardcap = 0;
    //this.PresalePrice = 0;
    //this.ListingPrice = 0;
    //this.LiquidityPercentage = 0;

    this.Mcap = 0;
    this.SolPricePerToken = 0;
    this.TransferFee = 0;
    this.IsWork = 0;
    this.YouWillUseHowManyTotalSupply = 0;
    this.TotalTokensNeeded = 0;
    this.TotalTokensNeededOnePercentageSolpad = 0;
    this.TotalTokensForPresale = 0;
    this.SoftCap = 0;
    this.TotalTokensForLiquidity = 0;
    this.TokenFee = 0;
    this.TotalSolOwnerWallet = 0;
    this.TotalSolForLiquidity = 0;
    this.TokensForSolPad = 0;
  }
}

export class Tokenomics {
  Name: string;
  Value: number;
  Sol?: number;
  IsEditable: boolean;
  Color: string;
}
