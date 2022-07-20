// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract FlipKards is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    BaseRelayRecipient
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);
    event TokenMinted(address to, uint256 tokenId);
    event repairAvailed(uint256 tokenId);
    event replacementAvailed(uint256 tokenId);
    event stateVariablesChanged(
        uint256 repairsSet,
        uint256 replacementSet,
        uint256 ValiditySet,
        string productName
    );

    //variables that are set by the retailer:
    uint256 private repairsSet;
    uint256 private replacementSet;
    uint256 private ValiditySet;
    string private productName;

    mapping(uint256 => uint256) internal TokenidToSerialno;
    mapping(uint256 => uint256) internal SerialnoToTokenid;
    mapping(uint256 => string) internal TokenidToname;
    mapping(uint256 => uint256) internal timestampBought;
    mapping(uint256 => uint256) internal timestampValid;
    mapping(uint256 => uint256) internal repairs;
    mapping(uint256 => uint256) internal repairsAvailed;
    mapping(uint256 => uint256) internal replacements;
    mapping(uint256 => uint256) internal replacementsAvailed;
    mapping(address => bool) public retailers;

    //MODIFIERS

    modifier isUnderWarrantyPeriod(uint256 _tokenId) {
        require(
            block.timestamp < timestampValid[_tokenId],
            "Warrant Period is Over"
        );
        _;
    }

    modifier isRetailer(address _sender) {
        require(retailers[_sender] == true, "Not an registered Retailer");
        _;
    }

    constructor(
        uint256 _repairsSet,
        uint256 _replacementSet,
        uint256 _ValiditySet,
        string memory _productName,
        address _retailerAddress
    ) ERC721("MyToken", "MTK") {
        repairsSet = _repairsSet;
        replacementSet = _replacementSet;
        ValiditySet = _ValiditySet;
        productName = _productName;
        retailers[_retailerAddress] = true;
    }

    // USER FUNCTIONS

    function mintToAddress(
        address _to,
        uint256 _serialNo,
        string memory _uri
    ) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        TokenidToSerialno[tokenId] = _serialNo;
        SerialnoToTokenid[_serialNo] = tokenId;
        TokenidToname[tokenId] = productName;
        timestampBought[tokenId] = block.timestamp;
        timestampValid[tokenId] = block.timestamp + ValiditySet;
        repairs[tokenId] = repairsSet;
        replacements[tokenId] = replacementSet;
        repairsAvailed[tokenId] = 0;
        replacementsAvailed[tokenId] = 0;

        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        emit TokenMinted(_to, tokenId);
    }

    function getCardbySerial(uint256 _serialNo) public view returns (uint256) {
        return SerialnoToTokenid[_serialNo];
    }

    function extendWarranty(uint256 _tokenId, uint256 _timeToExtend) public {
        require(ownerOf(_tokenId) == _msgSender());
        timestampValid[_tokenId] += _timeToExtend;
    }

    // RETAILER FUNCTIONS

    function changeRetailerVariables(
        uint256 _repairsSet,
        uint256 _replacementSet,
        uint256 _ValiditySet,
        string memory _productName
    ) public isRetailer(_msgSender()) {
        repairsSet = _repairsSet;
        replacementSet = _replacementSet;
        ValiditySet = _ValiditySet;
        productName = _productName;

        emit stateVariablesChanged(
            _repairsSet,
            _replacementSet,
            _ValiditySet,
            _productName
        );
    }

    function availRepairs(uint256 _tokenId)
        public
        isRetailer(_msgSender())
        isUnderWarrantyPeriod(_tokenId)
        returns (uint256)
    {
        require(
            repairsAvailed[_tokenId] < repairs[_tokenId],
            "All the repairs are Availed"
        );
        repairsAvailed[_tokenId]++;
        emit repairAvailed(_tokenId);
        return repairsAvailed[_tokenId];
    }

    function availReplacements(uint256 _tokenId)
        public
        isRetailer(_msgSender())
        isUnderWarrantyPeriod(_tokenId)
        returns (uint256)
    {
        require(
            replacementsAvailed[_tokenId] < replacements[_tokenId],
            "All replacements have been Availed"
        );
        replacementsAvailed[_tokenId]++;
        emit replacementAvailed(_tokenId);
        return replacementsAvailed[_tokenId];
    }

    function addRetailer(address _retailerAddress)
        public
        isRetailer(_msgSender())
    {
        retailers[_retailerAddress] = true;
    }

    // <----- SoulBound Token Implementation ----->

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        require(
            from == address(0) || to == address(0),
            "You can't transfer this Token"
        );
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        if (from == address(0)) {
            emit Attest(from, tokenId);
        } else if (to == address(0)) {
            emit Revoke(from, tokenId);
        }
    }

    function burn(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == _msgSender(),
            "Only token Owner can burn tokens"
        );
        _burn(tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // <------- BaseRelay Overrides for OpenZepplin Contracts ------->

    function setTrustedForwarderr(address _trustedForwarder) public {
        _setTrustedForwarder(_trustedForwarder);
    }

    function _msgSender()
        internal
        view
        override(Context, BaseRelayRecipient)
        returns (address sender)
    {
        sender = BaseRelayRecipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, BaseRelayRecipient)
        returns (bytes calldata)
    {
        return BaseRelayRecipient._msgData();
    }

    function versionRecipient() external pure override returns (string memory) {
        return "1";
    }
}
