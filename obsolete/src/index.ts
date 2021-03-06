import * as CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;
    
    static calcBlockHash = (index: number, previousHash: string, timestamp: number, data: string) : string => {
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    }

    static validateStructure = (aBlock: Block): boolean => {
        return typeof(aBlock.index) === "number" 
        && typeof(aBlock.hash) === "string" 
        && typeof(aBlock.previousHash) === "string"
        && typeof(aBlock.data) === "string"
        && typeof(aBlock.timestamp) === "number"; 
    }
    
    constructor (
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number) {
            this.index = index;
            this.hash = hash;
            this.previousHash = previousHash;
            this.data = data;
            this.timestamp = timestamp;
    }

}

const genesisBlock: Block = new Block(0, "202020202020", "", "Hello", 123456);

let blockChain: Block[] = [genesisBlock];

const getBlockChain = () : Block[] => blockChain
const getLatestBlock = () : Block => blockChain[blockChain.length - 1];
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const nextTimeStamp: number = getNewTimeStamp();
    const nextHash: string = Block.calcBlockHash(newIndex, previousBlock.hash, nextTimeStamp, data);

    const newBlock : Block = new Block(newIndex, nextHash, previousBlock.hash, data, nextTimeStamp);
    addBlock(newBlock);
    return newBlock;
}

const getHash4Block = (aBlock: Block): string => {
    return Block.calcBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);
}

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock) && !Block.validateStructure(previousBlock)) return false;
    if (previousBlock.index + 1 !== candidateBlock.index) return false;
    if (previousBlock.hash !== candidateBlock.previousHash) return false;
    if (getHash4Block(candidateBlock) !== candidateBlock.hash) return false;
    return true;
} 

const addBlock = (candidateBlock: Block): void => {
    if (!isBlockValid(candidateBlock, getLatestBlock())) return;
    else {
        blockChain.push(candidateBlock);
    }
}



console.log(createNewBlock("hello"), createNewBlock("bye bye"));

export {};