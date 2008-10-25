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
 *
 *
 */ 

/**
 *	@class SMBClient
 *	@abstract Wrapper object for the SMB smbclient command.
 *	@discussion This transport class allows WebSMS to message Windows machines
 *	running the Messenger service, by issuing SMB net send commands.
 */
function SMBClient()
{
	this._task = null;
}

// Inheritance
SMBClient.prototype = new CURLClient();

/**
 *	@method exec
 *	@abstract Performs a CURL request.
 */
SMBClient.prototype.exec = function()
{
	var command = "/bin/echo -n " + this._options[CURLOPT_POSTFIELDS];
	command += " | /usr/bin/smbclient -M " + this._options[CURLOPT_URL];

	__DEBUG(command);
	var callback = this._options[CURLOPT_RETURNFUNCTION];
	
	this._task = widget.system(command, null);
	callback("Status: %s".sprintf(this._task.status));
};

