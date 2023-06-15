// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Instagram {

   uint imgCount;

  struct Image{
    uint id;
    string ipfsHash;
    uint likes;
    string caption;
    uint tipAmount;
    address payable owner;
  }

  event ImageUploaded(
    uint id,
    string ipfsHash,
    uint likes,
    string caption,
    uint tipAmount,
    address payable owner
  );

  mapping(uint=>Image) public images;

  function getImgCount() public view returns(uint){
    return imgCount;
  }

  function getImages() public view returns(Image[] memory){
    uint count=imgCount;
    Image[] memory _images=new Image[](count+1);
    for(uint i=1; i<=count; i++)
    _images[i]=images[i];

    return _images;
  }

  function uploadImage(string memory _ipfsHash, string memory _caption) public {
      require(bytes(_ipfsHash).length>0);
      require(bytes(_caption).length>0);
      require(msg.sender!=address(0x0));

        // Increment image count
        unchecked { imgCount++; }
    
    // Minor gas optimization by reducing state variable access
      uint count = imgCount;
      images[count] = Image(count, _ipfsHash, 0, _caption, 0, payable(msg.sender));
      emit ImageUploaded(count, _ipfsHash, 0, _caption, 0, payable(msg.sender));
  }

  function likeImage(uint _id) public {
    require(_id>0 && _id<=imgCount);
     images[_id].likes++;
  }

  function tipImage(uint _id) payable public {
    require(_id>0 && _id<=imgCount);
    require(msg.value>0);

     Image memory img = images[_id];

     address payable _owner = img.owner;
     _owner.transfer(msg.value);
     img.tipAmount+=msg.value;
     images[_id]=img;

  }
  
}
