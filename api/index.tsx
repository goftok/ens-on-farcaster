import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { ethers } from 'ethers';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

const network = 'mainnet'
const contractAddress = "0x253553366Da8546fC250F225fe3d25d0C782303b"
const chainId = 1
const blockscountLink = "https://eth.blockscout.com/tx/"

// const network = 'sepolia'
// const contractAddress = "0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72"
// const chainId = 11155111
// const blockscountLink = "https://eth-sepolia.blockscout.com/tx/"


const slipagge = 10n;


const MIN_REGISTRATION_DURATION = 31536000;
const MIN_COMMITMENT_AGE = 60;
const MAX_COMMITMENT_AGE = 86400;

const abi = [{ "inputs": [{ "internalType": "contract BaseRegistrarImplementation", "name": "_base", "type": "address" }, { "internalType": "contract IPriceOracle", "name": "_prices", "type": "address" }, { "internalType": "uint256", "name": "_minCommitmentAge", "type": "uint256" }, { "internalType": "uint256", "name": "_maxCommitmentAge", "type": "uint256" }, { "internalType": "contract ReverseRegistrar", "name": "_reverseRegistrar", "type": "address" }, { "internalType": "contract INameWrapper", "name": "_nameWrapper", "type": "address" }, { "internalType": "contract ENS", "name": "_ens", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "bytes32", "name": "commitment", "type": "bytes32" }], "name": "CommitmentTooNew", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "commitment", "type": "bytes32" }], "name": "CommitmentTooOld", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "duration", "type": "uint256" }], "name": "DurationTooShort", "type": "error" }, { "inputs": [], "name": "InsufficientValue", "type": "error" }, { "inputs": [], "name": "MaxCommitmentAgeTooHigh", "type": "error" }, { "inputs": [], "name": "MaxCommitmentAgeTooLow", "type": "error" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "NameNotAvailable", "type": "error" }, { "inputs": [], "name": "ResolverRequiredWhenDataSupplied", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "commitment", "type": "bytes32" }], "name": "UnexpiredCommitmentExists", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": true, "internalType": "bytes32", "name": "label", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "baseCost", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "premium", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "expires", "type": "uint256" }], "name": "NameRegistered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": true, "internalType": "bytes32", "name": "label", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "cost", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "expires", "type": "uint256" }], "name": "NameRenewed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "MIN_REGISTRATION_DURATION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "available", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "commitment", "type": "bytes32" }], "name": "commit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "commitments", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bytes32", "name": "secret", "type": "bytes32" }, { "internalType": "address", "name": "resolver", "type": "address" }, { "internalType": "bytes[]", "name": "data", "type": "bytes[]" }, { "internalType": "bool", "name": "reverseRecord", "type": "bool" }, { "internalType": "uint16", "name": "ownerControlledFuses", "type": "uint16" }], "name": "makeCommitment", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "maxCommitmentAge", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minCommitmentAge", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nameWrapper", "outputs": [{ "internalType": "contract INameWrapper", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "prices", "outputs": [{ "internalType": "contract IPriceOracle", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "recoverFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bytes32", "name": "secret", "type": "bytes32" }, { "internalType": "address", "name": "resolver", "type": "address" }, { "internalType": "bytes[]", "name": "data", "type": "bytes[]" }, { "internalType": "bool", "name": "reverseRecord", "type": "bool" }, { "internalType": "uint16", "name": "ownerControlledFuses", "type": "uint16" }], "name": "register", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }], "name": "renew", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }], "name": "rentPrice", "outputs": [{ "components": [{ "internalType": "uint256", "name": "base", "type": "uint256" }, { "internalType": "uint256", "name": "premium", "type": "uint256" }], "internalType": "struct IPriceOracle.Price", "name": "price", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reverseRegistrar", "outputs": [{ "internalType": "contract ReverseRegistrar", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceID", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "valid", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]


interface SessionData {
  commitment: string;
  randomSecret: string;
  durationInSec: number;
  address: string;
}

// In-memory session object with a string index signature
const session: { [key: string]: SessionData } = {};

// const rentPrice = async (name: string, duration: number): Promise<ethers.BigNumber> => {
//   // Implement the logic to get the rent price for the name and duration
//   // This is just a placeholder function
//   return ethers.BigNumber.from(0);
// };

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  browserLocation: '/:path',
  imageAspectRatio: '1:1',
  title: 'ENS Register',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

function generateRandomBytes32() {
  return ethers.hexlify(ethers.randomBytes(32));
}

export const generateImageComponent = (text: string) => {
  return (
    <div
      style={{
        alignItems: 'center',
        background: '#f3f5f7',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          // fontFamily: 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          color: '#819cf2',
          fontSize: '2.875rem',
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 30,
          marginLeft: 60,
          marginRight: 60,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    </div>
  )
}

app.frame('/', (c) => {
  const text = 'Register your ENS name'
  return c.res({
    action: '/check',
    image: generateImageComponent(text),
    intents: [
      <TextInput placeholder="Search for a name..." />,
      <Button value='search'>Search</Button>,
      <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

app.frame('/check', async (c) => {
  const name = c.inputText

  const provider = new ethers.InfuraProvider(network, process.env.INFURA_API_KEY);
  const contract = new ethers.Contract(contractAddress, abi, provider);


  if (!name) {
    return c.res({
      action: '/check',
      image: generateImageComponent('Name is required'),
      intents: [
        <TextInput placeholder="Search for a name..." />,
        <Button value='search'>Search</Button>,
      ]
    })
  }

  let isAvailable;
  try {
    isAvailable = await contract.available(name);
  } catch (error) {
    console.error('Error checking name availability:', error);
    return c.res({
      action: '/check',
      image: generateImageComponent('Error checking name availability'),
      intents: [
        <TextInput placeholder="Search for a name..." />,
        <Button value='search'>Search</Button>,
      ]
    });
  }

  if (!isAvailable) {
    return c.res({
      action: '/check',
      image: generateImageComponent('Name is not available'),
      intents: [
        <TextInput placeholder="Search for a name..." />,
        <Button value='search'>Search</Button>,
      ]
    });
  }


  const text = 'Choose duration'
  let targetLink = `/commit/${name}`
  return c.res({
    action: `/wait/${name}`,
    image: generateImageComponent(text),
    intents: [
      <Button.Transaction target={targetLink}>1 year</Button.Transaction>,
      <Button.Transaction target={targetLink}>2 years</Button.Transaction>,
      <Button.Transaction target={targetLink}>3 years</Button.Transaction>,
    ],

  })
})

app.transaction('/commit/:name', async (c) => {
  const name = c.req.param('name')
  const duration = c.buttonIndex
  const address = c.address

  if (!duration || !name) {
    throw new Error('Name and duration are required');
  }

  const durationInSec = duration * 31536000;
  const randomSecret = generateRandomBytes32();
  const provider = new ethers.InfuraProvider(network, process.env.INFURA_API_KEY);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  let commitment;
  try {
    commitment = await contract.makeCommitment(name, address, durationInSec, randomSecret, address, [], false, 0);
  } catch (error) {
    console.error('Error checking commitment hash:', error);
    throw new Error('Error checking commitment hash');
  }


  session[name] = { commitment, randomSecret, durationInSec, address };

  return c.contract({
    abi,
    chainId: `eip155:${chainId}`,
    functionName: 'commit',
    to: contractAddress,
    args: [commitment],
  })
})


app.frame('/wait/:name', (c) => {
  const name = c.req.param('name')
  const commitmentData = session[name];

  if (!commitmentData) {
    throw new Error('Commitment data not found');
  }

  const text = 'Wait 60 seconds'
  let targetLink = `/register/${name}`

  const link = `${blockscountLink}${c.transactionId}`

  return c.res({
    action: '/success',
    image: generateImageComponent(text),
    intents: [
      <Button.Transaction target={targetLink}>Register</ Button.Transaction >,
      <Button.Link href={link}>See transaction</Button.Link>,
    ],
  })
})

app.transaction('/register/:name', async (c) => {
  const name = c.req.param('name')
  const commitmentData = session[name];
  const durationInSec = commitmentData.durationInSec;

  if (!commitmentData) {
    throw new Error('Commitment data not found');
  }

  const provider = new ethers.InfuraProvider(network, process.env.INFURA_API_KEY);
  const contract = new ethers.Contract(contractAddress, abi, provider);


  // Wait for the rent price to be resolved
  let rentPrice;
  try {
    rentPrice = await contract.rentPrice(name, durationInSec);
  } catch (error) {
    console.error('Error getting rent price:', error);
    throw new Error('Error getting rent price');
  }

  const actualRentPrice = BigInt(rentPrice[0]);

  const premium = actualRentPrice * slipagge / 100n;
  const value = actualRentPrice + premium;

  return c.contract({
    abi,
    chainId: `eip155:${chainId}`,
    functionName: 'register',
    to: contractAddress,
    args: [name, commitmentData.address, commitmentData.durationInSec, commitmentData.randomSecret, commitmentData.address, [], false, 0],
    value: value,
  })
})

app.frame('/success', (c) => {
  const text = 'Success!'

  const link = `${blockscountLink}${c.transactionId}`
  return c.res({
    image: generateImageComponent(text),
    intents: [
      <Button.Reset>Home</Button.Reset>,
      <Button.Link href={link}>See transaction</Button.Link>,
    ],
  })
})


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
