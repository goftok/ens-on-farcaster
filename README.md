# ENS Registration with Farcaster
This project provides an ENS (Ethereum Name Service) registration interface built on Farcaster Frames. Users can search for, commit to, and register ENS names. The project also includes integration with BlockScout to view transaction details.

# Installation
1. Clone the repository
```
git clone git@github.com:goftok/ens-on-farcaster.git
```

2. Install dependencies and run the project
```
npm install
```

3. Set up environment variables in the .env:

```
INFURA_API_KEY=your_infura_api_key
```

4. Run the development server:

```
npm run dev
```


### Main Components
**FrogUI**: This project uses FrogUI to create a dynamic interface for ENS registration.
**Warpcast**: Integrates with Warpcast Frames.
**BlockScout**: Provides transaction tracking capabilities.

## ENS Registration Process
1. Search for a Name:

Users can input a name to check its availability.

2. Choose Duration:

If the name is available, users can select the registration duration (1, 2, or 3 years).

3. Commit Transaction:

The commitment is made to ensure the name is locked for registration.

4. Wait 60 sec:

Users are prompted to wait for a short period (e.g., 60 seconds) to prevent front-running.

5. Register:

The final registration step confirms the ENS name and completes the transaction.

6. Success:

Users receive confirmation of a successful registration and can view the transaction on BlockScout.


## Hosting

The project is hosted on Vercel and can be accessed at the following URL: [https://hackathon5.vercel.app/](https://hackathon5.vercel.app/)
