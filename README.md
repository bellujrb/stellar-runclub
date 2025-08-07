> _TEAM Stellar Runclub

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Mobile-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Stellar-yellow)

[Swagger API](https://stellar-api-v2-production.up.railway.app/docs)
[Demo](http://stellar-runclub.vercel.app/)
[Deploy Testnet](https://stellar.expert/explorer/testnet/contract/CDIJN5LCNOVQZOBIRLAD32PAR2EHYMS7T7YSE6TWSK7RE4CMGT67CC3M)


---

### 🌐 Introduction

Stellar Run Club is a gamified running platform that transforms physical activity into real financial rewards. Built with Soroban smart contracts on the Stellar blockchain, it enables organizers to create running clubs, deposit USDC as prize pools, and reward participants with KM tokens based on the distance they run.

---

### 🔴 Stellar

Stellar Run Club is built on the Stellar blockchain, chosen for its low fees, fast transactions, and developer-friendly Soroban smart contract framework. It ensures an affordable and scalable experience for both users and organizers.

--- 

### 🔗 Deploy in Testnet

- **Contract ID**: `CDIJN5LCNOVQZOBIRLAD32PAR2EHYMS7T7YSE6TWSK7RE4CMGT67CC3M`
- **Network**: Stellar Testnet
- **WASM Hash**: `507ae36b7ccf47daeed866cf776cc6ea62fcb3ef4469f80ca20d56981f2f336f`
- **Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDIJN5LCNOVQZOBIRLAD32PAR2EHYMS7T7YSE6TWSK7RE4CMGT67CC3M)

📄 **Contract Deployed:**  

---

### ⚙️ Note on Backend Integration

Due to the complexity of the architecture and a small team, the hackathon timeframe was not enough to fully integrate the backend with the frontend. However, the Swagger API is fully prepared with all smart contract interactions already implemented and ready for integration.

---

## Application Flow (Step-by-step)

1. **User Logs In**

   - Users sign in using social login accounts like Google, Facebook, or Apple via CLERK.
   - After login, the backend automatically creates a **digital wallet** for the user to store club tokens. The user doesn’t need to set up anything and can see a unique QR code in the app that identifies their wallet.

2. **User Creates a Club**

   - The user (acting as organizer) accesses the club creation section.
   - They select a club name (which becomes the token name), set the total USDC incentive amount, define the ratio between kilometers run and tokens earned (e.g., 1 km = 1 KM token), and choose payout rules:
     - Equal share for all members, or
     - Larger rewards for users who run more, proportional to their tokens.
   - To activate the club, the organizer deposits the USDC incentive amount.
   - After activation, the organizer can invite others via shareable links or codes.
   - Invited users log in and accept the invite to join the club.

3. **Organizer Deposits USDC Incentives**

   - The organizer deposits the chosen USDC amount via a secure payment method in the app (like bank transfer with QR code).
   - The funds are held securely by the backend, ready to be distributed as prizes.

4. **USDC Is Allocated in Soroswap**

   - The deposited USDC is automatically placed into a secure swap system called Soroswap.
   - This ensures the funds remain available, possibly generating returns until they are distributed, according to club rules.

5. **Users Run and Earn Club Tokens**

   - Users track their runs using iPhone or Apple Watch.
   - The app records the kilometers run each session.
   - Based on the predefined ratio, users earn KM tokens for every kilometer.
   - Tokens are added automatically to their wallet.
   - Users can monitor their KM tokens and total USDC incentives in the club.

6. **Competition and Ranking**

   - Throughout the month, the app displays a ranking leaderboard showing token balances for all club members.
   - Users see their standing and compare progress with others.

7. **Redeeming USDC at Month End**

   - At the end of the month, users redeem their KM tokens for USDC following club payout rules:
     - **Equal distribution**: total USDC divided equally among members with tokens.
     - **Unlimited distribution**: users with more tokens redeem larger shares, up to the available limit.
   - To redeem, users check their token balance in the club, request a payout, and provide a destination address or use an integrated option to receive USDC.

8. **Withdrawing to External Wallet**

   - In the app settings, users can choose to transfer USDC to an external wallet by entering a secure address.
   - The transfer is processed safely without the user needing to handle technical details.

9. **Viewing Wallet QR Code**

   - Users can view their wallet’s unique QR code anytime in the app.
   - This QR code serves as an identifier and can be shared with support if needed.

10. **Starting a New Competition**

    - After the monthly cycle ends, organizers can start a new competition by creating a new club or renewing the existing one.
    - The cycle of deposits, running, and rewards repeats.

---

## 🛠 Installation (Front-end)

1. **Prerequisites**
    - Make sure you have NodeJS installed on your machine.

2. **Clone the Repository**

    ```bash
    git clone https://github.com/bellujrb/stellar-runclub/front-end
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Launch the App**

    ```bash
    npm run dev
    ```

## 🛠 Installation (NestJS Back-end)

1. **Prerequisites**  
   - Make sure you have Node.js installed on your machine.  
   - (Optional) Have a package manager like npm or yarn installed.

2. **Clone the Repository**

    ```bash
    git clone https://github.com/bellujrb/stellar-runclub/back-end
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Run the development server**

    ```bash
    npm run start:dev
    ```

5. **Access the API**  
   Usually, the NestJS app runs on [http://localhost:3000](http://localhost:3000) by default.


## 🛠 Deploy Contract (Blockchain)

1. **Navigate to the contract directory**

   ```bash
    cd stellar-runclub/blockchain/contracts/run-club
    ```

3. **Build the contract**

    ```bash
    stellar contract build
    ```

4. **Deploying the Contract**

    ```bash
    # Deploy to testnet
    ./deploy.sh
    ```

5. **Testing the Contract**

    ```bash
    # Run basic functionality tests
    ./test_contract.sh
    ```

---

## 📂 Project File Tree
    
```
stellar-runclub
├── back-end
│   └── src
│       └── ...
│   └── test
│       └── ...
│   └── ...
├── blockchain
│   └── contracts/runclub
│       └── src
│           └── club_manager
│               └── club_operations
│               └── club_queries
│               └── club_validation
│           └── lib.rs
│       └── tests
│           └── ...
│   └── main.ts
│       └── src
│           └── index.ts
├── frontend
│   └── ...
├── README.MD
```
---

#### `stellar-runclub`

- `back-end`
    - Backend Application
- `blockchain`
    - Blockchain (Soroban)
- `front-end`
    - Frontend Application
- `README.md`
    - Documentation
 
---

## 🙏 Thanks

Special thanks to Stellar for this ambitious opportunity.

---
