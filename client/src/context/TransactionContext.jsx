import React, { useEffect, useState, useMemo, useCallback } from 'react';
//import { injected } from './injected';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

// Connect to blockchain

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    });

    return transactionContract;
}


// Wrapping entire react application with all data that gets passed into it
export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState('');
    //const [defaultAccount, setDefaultAccount] = useState(null);
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount')); // store it on local storage since it resets everytime u refresh

    // accepts events/keypresses,  prevstate -> new object // find out how it works
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
    
    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
        
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log(accounts);

            if (accounts.length){

                setCurrentAccount(accounts[0]);
                //accountChangedHandler(accounts[0]);
                // getAllTransactions();
            } else {
                console.log(error)
                throw new Error("No ethereum object.")
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
        
    };

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        //await getUserBalance(newAccount);
    };

    

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");
            // See all accounts and can choose to connect to 1
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0]);

            setCurrentAccount(accounts[0]);
            //accountChangedHandler(accounts[0]);
            //setCurrentAccount(accounts[0]);
            //await activate(injected)
            //window.location.reload();
            
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")

        }
    };

    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");
            const {addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount); // Converts decimal into gwei hexadecimal

            await ethereum.request({ 
                method: 'eth_sendTransaction', 
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // hexadecimal - 21000 GWEI
                    value: parsedAmount._hex, // 0.00001
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            
            setIsLoading(true);
            console.log(`Loading - $(transactionHash.hash)`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - $(transactionHash.hash)`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

        } catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}

