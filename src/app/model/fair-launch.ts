export class FairLaunch {
  //inputs
  TotalSupply: number;
  TotalTokensForFairLaunch: number;
  SoftCap: number;
  LiquidityPercentage: number;

  //fair Launch Rate
  FairLaunchRate: number;

  //Check if it works or not
  IsWork: number;

  //Total Tokens for PreSale
  TotalTokensForPresale: number;

  //Total Tokens for Liquidity
  TotalTokensForLiquidity: number;

  //Percentage you will use of the total supply
  YouWillUseHowManyTotalSupply: number;

  //Initial Market Cap
  Mcap: number;

  //Token fee
  TokenFee: number;

  TotalTokensNeededOnePercentageSolpad: number;
  TokensForSolPad: number;
  TotalSolOwnerWallet: number;
  TotalSolForLiquidity: number;
  TotalTokensNeeded: number;

  ListTokenomics: Tokenomics[];

  constructor() {
    //this.TotalSupply = 0;
    //this.Hardcap = 0;
    //this.PresalePrice = 0;
    //this.ListingPrice = 0;
    //this.LiquidityPercentage = 0;

    this.IsWork = 0;
    this.YouWillUseHowManyTotalSupply = 0;
    this.TokenFee = 0;
    this.Mcap = 0;
    this.TokensForSolPad = 0;
    this.TotalSolOwnerWallet = 0;
    this.TotalTokensNeeded = 0;
    this.TotalSolForLiquidity = 0;
    this.TotalTokensForPresale = 0;
    this.TotalTokensForLiquidity = 0;
    this.TotalTokensNeededOnePercentageSolpad = 0;
  }
}

export class Tokenomics {
  Name: string;
  Value: number;
  Sol?: number;
  IsEditable: boolean;
  Color: string;
}
