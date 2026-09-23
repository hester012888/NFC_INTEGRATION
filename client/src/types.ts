export interface Exhibit {
    id: string
    nfcTag: string
    name: string
    hall: string
    dynasty: string
    category: string
    imageUrl: string
    stampColor: string
    stampSymbol: string
    challenge: string
    challengeOptions: string[]
    challengeAnswer: number
    funFact: string
    description: string
    detail: string
    material: string
    dimensions: string
    audioLength: string
    audioSrc: {
      zh: string
      en?: string
      yue?: string
      ja?: string
    }
  }
  
  export interface StampRecord {
    exhibitId: string
    time: string
    answeredCorrect: boolean
  }
  
  export type Screen =
    | "mini"
    | "home"
    | "tap"
    | "tapping"
    | "challenge"
    | "stamp"
    | "detail"
    | "collection"
    | "souvenir"