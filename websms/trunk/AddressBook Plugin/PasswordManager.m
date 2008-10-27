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
 *	PasswordManager.m
 *	ABPlugin
 *
 *	Created by delphine on 5-04-2008.
 *	Copyright 2008 Claudio Procida - Emeraldion Lodge. All rights reserved.
 */

#import "PasswordManager.h"


@implementation PasswordManager

- (id)init
{
	if (self = [super init])
	{
		kcItemRefs = [[NSMutableDictionary alloc] init];
	}
	return self;
}

- (void)dealloc
{
	[kcItemRefs release];
	[super dealloc];
}

- (void)setPassword:(NSString *)pass forService:(NSString *)srv accountName:(NSString *)acct
{
	if (srv != nil &&
		acct != nil &&
		pass != nil)
	{
		OSStatus status;
		
		UInt32 passwordLength = [pass length];
		const char *password = [pass UTF8String];

		NSString *service = [NSString stringWithFormat:PMServiceNameFormat, srv, acct];
		
		void *serviceName = (void *)[service UTF8String];
		UInt32 serviceNameLength = [service length];
		
		void *acctName = (void *)[acct UTF8String];
		UInt32 acctNameLength = [acct length];
		
		SecKeychainItemRef kcItemRef = [kcItemRefs objectForKey:srv];

		if (!kcItemRef)
		{			
			status = SecKeychainAddGenericPassword (
													NULL,				// default keychain
													serviceNameLength,	// length of service name
													serviceName,		// service name
													acctNameLength,		// length of account name
													acctName,			// account name
													passwordLength,		// length of password
													password,			// pointer to password data
													NULL				// the item reference
													);
		}
		else
		{
			SecKeychainAttribute attr[2];
			attr[0].tag = kSecAccountItemAttr;
			attr[0].data = acctName;
			attr[0].length = acctNameLength;

			attr[1].tag = kSecServiceItemAttr;
			attr[1].data = serviceName;
			attr[1].length = serviceNameLength;
			
			SecKeychainAttributeList attrList;
			attrList.attr = attr;
			attrList.count = 2;
			
			status = SecKeychainItemModifyAttributesAndData (
															 kcItemRef,		// the item reference
															 &attrList,		// the attributes list
															 passwordLength,// length of password
															 password		// pointer to password data
															 );
		}
	}
}

- (NSString *)passwordForService:(NSString *)srv accountName:(NSString *)acct
{
	if (srv != nil &&
		acct != nil)
	{
		unsigned char *passwordData = nil;
		UInt32 passwordLength;
	
		NSString *service = [NSString stringWithFormat:PMServiceNameFormat, srv, acct];
		
		void *serviceName = (void *)[service UTF8String];
		UInt32 serviceNameLength = [service length];
		
		void *acctName = (void *)[acct UTF8String];
		UInt32 acctNameLength = [acct length];
		
		SecKeychainItemRef kcItemRef;
		
		OSErr status = SecKeychainFindGenericPassword (
													   NULL,				// default keychain
													   serviceNameLength,// length of service name
													   serviceName,		// service name
													   acctNameLength,   // length of account name
													   acctName,			// account name
													   &passwordLength,	// length of password
													   &passwordData,	// pointer to password data
													   &kcItemRef		// the item reference
													   );
		if (status == noErr)
		{
			[kcItemRefs setObject:kcItemRef
						   forKey:srv];
			
			NSString *pass = [NSString stringWithCString:passwordData length:passwordLength];
			status = SecKeychainItemFreeContent (
												 NULL,           //No attribute data to release
												 passwordData    //Release data buffer allocated by 
																 //SecKeychainFindGenericPassword
												 );
			return pass;
		}
	}
	return @"";
}

@end
