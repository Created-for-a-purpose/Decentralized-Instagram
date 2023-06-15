const Instagram = artifacts.require("Instagram");

contract('Decentralized Instagram', () => {
  let instagram;
   before(async ()=>{
    instagram = await Instagram.deployed();
   })

   it('Contract deployed successfully', async()=>{
    const address = await instagram.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
   });
   
});
