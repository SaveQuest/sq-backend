declare module "http" {
   export interface IncomingMessage {
      userId: number
   }

   export interface usedAmount{
      content: string,
      amount: number,
      date: Date,
      userId: number
   }
}
