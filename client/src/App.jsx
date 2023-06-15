import React, {useState, useEffect} from 'react'
import Web3 from 'web3'
import './styles.css';
import Navbar from './Navbar'
import Instagram from './contracts/Instagram.json'
import {Buffer} from 'buffer'
import {create} from 'ipfs-http-client'

const projectId = ''; //Put your infura ipfs api id
const projectSecret = ''; //Put your infura ipfs api secret
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = create({host: 'ipfs.infura.io', port:5001,protocol: 'https',
headers: {
  authorization: auth,
},})


function App() {
  const[web3, setWeb3] = useState(null)
  const[account, setAccount] = useState('0x0')
  const[contract, setContract] = useState(null)
  const[caption, setCaption] = useState('')
  const[imageBuffer, setBuffer]=useState(null)
  const[images, setImages]=useState([])
 
  useEffect(()=>{
      const init = async()=>{
         if(window.ethereum){
              window.web3=new Web3(window.ethereum)
              await window.ethereum.enable()
         }
         else if(window.web3){
          window.web3=new Web3(window.web3.currentProvider)
         }

         const web3=window.web3;
         const accounts=await web3.eth.getAccounts()
         setAccount(accounts[0])
         setWeb3(web3)

         const networkId=await web3.eth.net.getId()
         const networkData = Instagram.networks[networkId]
         if(!networkData) window.alert('Contract not deployed !')
         // Instance of contract
         const instagram = new web3.eth.Contract(Instagram.abi, networkData.address)
         setContract(instagram)

         const imageCount = await instagram.methods.getImgCount().call()
         console.log(imageCount)
         
          const image = await instagram.methods.getImages().call()
          setImages(image)
         
         
      }
      init();
  }, [] )

  const captureFile = (event)=>{
   event.preventDefault()
   const file = event.target.files[0]
   const reader = new window.FileReader()
   reader.readAsArrayBuffer(file)

   reader.onloadend=()=>{
    setBuffer(Buffer(reader.result))
    // console.log('Buffer', reader.result)
   }

  }

  const uploadImage = async (event)=>{
        event.preventDefault();
        const {path} = await ipfs.add(imageBuffer)
        
             await contract.methods.uploadImage(path, caption).send({
              from: account
             })
    };
  

  return (
    <div className='container'>
      <Navbar account={account}/>
    <h2>Upload Image</h2>
    <form onSubmit={uploadImage}>
      <div className='content'>
      <input type="file" accept='.jpg, .jpeg, .png, .gif' onChange={captureFile} required/>
      <br />
      </div>
      <div>
      <input type="text" placeholder='Image caption...' onChange={(e)=>setCaption(e.target.value)} required/>
      <br />
      </div>
     <button type="submit">Upload</button>
    </form>
    {
      images.slice(1).map((image, key)=>{
        
        return(
          <div className='image-list'>
            <div>
              <small>Uploaded by: {image.owner}</small>
            </div>
            
              <div className='image-box'>
                <img src={`https://ipfs.io/ipfs/${image.ipfsHash}`} style={{maxWidth: '420px'}} />
                <p>{image.caption}</p>
              
              <div className='image-details'>
                <small>Tips: {web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH</small>
                <button onClick={async (event)=>{
                  event.preventDefault()
                  console.log(key)
                  await contract.methods.tipImage(key+1).send({from:account, value:web3.utils.toWei('0.1', 'ether')})

                }}>Tip 0.1 ETH</button>
              </div>
              </div>
            
          </div>
        )
      })
    }
    </div>
    
  );
}

export default App;
