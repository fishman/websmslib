/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006-2008
 *
 *	Disclaimer
 *
 *	The WebSMS Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not its author(s), assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 */

var COUNTRY_CODE_KEY = "Country Code";

/**
 *	@singleton CountrySelector
 *	@abstract Object which manages the user's country code.
 */
var CountrySelector = {};

/**
 *	@method init
 *	@abstract Initializes the country selector.
 *	@discussion This method populates the country selection list
 *	and sets the default country according to user preferences.
 */
CountrySelector.init = function()
{
	CountryCode.ownCode = widget.preferenceForKey(COUNTRY_CODE_KEY);
	
	var cSel = document.getElementById("countryCodeList");
	for (var i = 0; i < CountryCodes.length; i++)
	{
		cSel.options[i] = new Option(CountryCodes[i][0] + " (+" + CountryCodes[i][1] + ")",
			CountryCodes[i][1]);
		if (CountryCodes[i][1] == CountryCode.ownCode)
			cSel.options[i].selected = true;
	}
};

/**
 *	@method update
 *	@abstract Event handler for country selection changes.
 *	@discussion This method sets the country code user preference,
 *	according to the user's selection.
 *	@param list The country selection list.
 */
CountrySelector.update = function(list)
{
	CountryCode.ownCode = list.value;
	widget.setPreferenceForKey(CountryCode.ownCode, COUNTRY_CODE_KEY);		
	__DEBUG("Set country code to " + CountryCode.ownCode);
};

/**
 *	@singleton CountryCode
 *	@abstract Country code model class.
 */
var CountryCode =
{
	ownCode: null
};

/**
 *	@method forNumber
 *	@abstract Returns the country code for <tt>number</tt>.
 *	@discussion This method tries to match the initial part of
 *	<tt>number</tt> with a country code in <tt>CountryCodes</tt>.
 *	It returns the user's own code as a failover.
 *	@param the_num The number to return the country code for.
 *	@result The country code for <tt>number</tt>.
 */
CountryCode.forNumber = function(the_num)
{
	var num = new String(the_num);
	var iterator = new Iterator().withValues(CountryCodes);
	for (var code; code = iterator.next(); )
	{
		// If the number has an international code, return it
		var reg = new RegExp("^(\\+|00)" + code[1]);

		if (num.match(reg))
		{
			return code[1];
		}
	}
	// Otherwise, assume it's the same as the caller
	return this.ownCode;
};

/**
 *	@method numberByStrippingCode
 *	@abstract Strips the country code from <tt>number</tt>.
 *	@discussion This method, somehow complementary to <tt>forNumber</tt>,
 *	strips a country code found in <tt>CountryCodes</tt> from <tt>number</tt>.
 *	@param the_num The number to return the country code for.
 *	@result <tt>number</tt> with country code stripped.
 */
CountryCode.numberByStrippingCode = function(the_num)
{
	var num = new String(the_num);
	var iterator = new Iterator().withValues(CountryCodes);
	for (var code; code = iterator.next(); )
	{
		if (num.indexOf(("+" + code[1])) != -1)
		{
			return num.substring(("+" + code[1]).length);
		}
		else if (num.indexOf(("00" + code[1])) != -1)
		{
			return num.substring(("00" + code[1]).length);
		}
	}
	// Give up
	return the_num;
};

/**
 *	A (hopefully) complete list of country codes.
 */
var CountryCodes = [
["Afghanistan","93"],
["Albania","355"],
["Algeria","213"],
["American Samoa","1684"],
["Andorra","376"],
["Angola","244"],
["Anguilla","1264"],
["Antarctica","672"],
["Antigua","1268"],
["Argentina","54"],
["Armenia","374"],
["Aruba","297"],
["Ascension","247"],
["Australia","61"],
["Australian External Territories","672"],
["Austria","43"],
["Azerbaijan","994"],
["Bahamas","1242"],
["Bahrain","973"],
["Bangladesh","880"],
["Barbados","1246"],
["Barbuda","1268"],
["Belarus","375"],
["Belgium","32"],
["Belize","501"],
["Benin","229"],
["Bermuda","1441"],
["Bhutan","975"],
["Bolivia","591"],
["Bosnia & Herzegovina","387"],
["Botswana","267"],
["Brazil","55"],
["British Virgin Islands","1284"],
["Brunei Darussalam","673"],
["Bulgaria","359"],
["Burkina Faso","226"],
["Burundi","257"],
["Cambodia","855"],
["Cameroon","237"],
["Canada","1"],
["Cape Verde Islands","238"],
["Cayman Islands","1345"],
["Central African Republic","236"],
["Chad","235"],
["Chile","56"],
["China (PRC)","86"],
["Christmas Island","618"],
["Cocos-Keeling Islands","61"],
["Colombia","57"],
["Comoros","269"],
["Congo","242"],
["Congo, Dem. Rep. of (former Zaire)","243"],
["Cook Islands","682"],
["Costa Rica","506"],
["Croatia","385"],
["Cuba","53"],
["Cuba (Guantanamo Bay)","5399"],
["Curaçao","599"],
["Cyprus","357"],
["Czech Republic","420"],
["Côte d'Ivoire (Ivory Coast)","225"],
["Denmark","45"],
["Diego Garcia","246"],
["Djibouti","253"],
["Dominica","1767"],
["Dominican Republic","1809"],
["EMSAT (Mobile Satellite service)","88213"],
["East Timor","670"],
["Easter Island","56"],
["Ecuador","593"],
["Egypt","20"],
["El Salvador","503"],
["Ellipso (Mobile Satellite service)","8812"],
["Ellipso (Mobile Satellite service)","8813"],
["Equatorial Guinea","240"],
["Eritrea","291"],
["Estonia","372"],
["Ethiopia","251"],
["Falkland Islands (Malvinas)","500"],
["Faroe Islands","298"],
["Fiji Islands","679"],
["Finland","358"],
["France","33"],
["French Antilles","596"],
["French Guiana","594"],
["French Polynesia","689"],
["Gabonese Republic","241"],
["Gambia","220"],
["Georgia","995"],
["Germany","49"],
["Ghana","233"],
["Gibraltar","350"],
["Global Mobile Satellite System (GMSS)","881"],
["Globalstar (Mobile Satellite Service)","8818"],
["Globalstar (Mobile Satellite Service)","8819"],
["Greece","30"],
["Greenland","299"],
["Grenada","1473"],
["Guadeloupe","590"],
["Guam","1671"],
["Guantanamo Bay","5399"],
["Guatemala","502"],
["Guinea","224"],
["Guinea-Bissau","245"],
["Guyana","592"],
["Haiti","509"],
["Honduras","504"],
["Hong Kong","852"],
["Hungary","36"],
["ICO Global (Mobile Satellite Service)","8810"],
["ICO Global (Mobile Satellite Service)","8811"],
["Iceland","354"],
["India","91"],
["Indonesia","62"],
["Inmarsat (Atlantic Ocean - East)","871"],
["Inmarsat (Atlantic Ocean - West)","874"],
["Inmarsat (Indian Ocean)","873"],
["Inmarsat (Pacific Ocean)","872"],
["Inmarsat SNAC","870"],
["International Freephone Service","800"],
["International Shared Cost Service (ISCS)","808"],
["Iran","98"],
["Iraq","964"],
["Ireland","353"],
["Iridium (Mobile Satellite service)","8816"],
["Iridium (Mobile Satellite service)","8817"],
["Israel","972"],
["Italy","39"],
["Jamaica","1876"],
["Japan","81"],
["Jordan","962"],
["Kazakhstan","7"],
["Kenya","254"],
["Kiribati","686"],
["Korea (North)","850"],
["Korea (South)","82"],
["Kuwait","965"],
["Kyrgyz Republic","996"],
["Laos","856"],
["Latvia","371"],
["Lebanon","961"],
["Lesotho","266"],
["Liberia","231"],
["Libya","218"],
["Liechtenstein","423"],
["Lithuania","370"],
["Luxembourg","352"],
["Macao","853"],
["Macedonia (Former Yugoslav Rep of.)","389"],
["Madagascar","261"],
["Malawi","265"],
["Malaysia","60"],
["Maldives","960"],
["Mali Republic","223"],
["Malta","356"],
["Marshall Islands","692"],
["Martinique","596"],
["Mauritania","222"],
["Mauritius","230"],
["Mayotte Island","269"],
["Mexico","52"],
["Micronesia, (Federal States of)","691"],
["Midway Island","1808"],
["Moldova","373"],
["Monaco","377"],
["Mongolia","976"],
["Montenegro","382"],
["Montserrat","1664"],
["Morocco","212"],
["Mozambique","258"],
["Myanmar","95"],
["Namibia","264"],
["Nauru","674"],
["Nepal","977"],
["Netherlands","31"],
["Netherlands Antilles","599"],
["Nevis","1869"],
["New Caledonia","687"],
["New Zealand","64"],
["Nicaragua","505"],
["Niger","227"],
["Nigeria","234"],
["Niue","683"],
["Norfolk Island","672"],
["Northern Marianas Islands (Saipan, Rota, & Tinian)","1670"],
["Norway","47"],
["Oman","968"],
["Pakistan","92"],
["Palau","680"],
["Palestinian Settlements","970"],
["Panama","507"],
["Papua New Guinea","675"],
["Paraguay","595"],
["Peru","51"],
["Philippines","63"],
["Poland","48"],
["Portugal","351"],
["Puerto Rico","1787"],
["Qatar","974"],
["Romania","40"],
["Russia","7"],
["Rwandese Republic","250"],
["Réunion Island","262"],
["Samoa","685"],
["San Marino","378"],
["Saudi Arabia","966"],
["Senegal","221"],
["Serbia","381"],
["Seychelles Republic","248"],
["Sierra Leone","232"],
["Singapore","65"],
["Slovak Republic","421"],
["Slovenia","386"],
["Solomon Islands","677"],
["Somali Democratic Republic","252"],
["South Africa","27"],
["Spain","34"],
["Sri Lanka","94"],
["St. Helena","290"],
["St. Kitts/Nevis","1869"],
["St. Lucia","1758"],
["St. Pierre & Miquelon","508"],
["St. Vincent & Grenadines","1784"],
["Sudan","249"],
["Suriname","597"],
["Swaziland","268"],
["Sweden","46"],
["Switzerland","41"],
["Syria","963"],
["São Tomé and Principe","239"],
["Taiwan","886"],
["Tajikistan","992"],
["Tanzania","255"],
["Thailand","66"],
["Thuraya (Mobile Satellite service)","88216"],
["Timor Leste","670"],
["Togolese Republic","228"],
["Tokelau","690"],
["Tonga Islands","676"],
["Trinidad & Tobago","1868"],
["Tunisia","216"],
["Turkey","90"],
["Turkmenistan","993"],
["Turks and Caicos Islands","1649"],
["Tuvalu","688"],
["US Virgin Islands","1340"],
["Uganda","256"],
["Ukraine","380"],
["United Arab Emirates","971"],
["United Kingdom","44"],
["United States of America","1"],
["Universal Personal Telecommunications (UPT)","878"],
["Uruguay","598"],
["Uzbekistan","998"],
["Vanuatu","678"],
["Vatican City","379"],
["Venezuela","58"],
["Vietnam","84"],
["Wake Island","808"],
["Wallis and Futuna Islands","681"],
["Yemen","967"],
["Zambia","260"],
["Zanzibar","255"],
["Zimbabwe","263"]
];