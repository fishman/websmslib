//
//  TransportClient.h
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#endif
#ifdef IPHONE
	#import <Foundation/Foundation.h>
#endif
/*
 * This protocol was implemented by WebSMSEngine
 */
@protocol TransportClient_Delegate
	- (void) tclient_connectionFailed:(NSString *) _error;			// connection to server failed
	- (void) tclient_connectionEstablished;							// connection for this step established
	- (void) tclient_serverDataReceived:(NSString *) _sData;			// data from server received
	- (void) tclient_serverBadResponseAtURL:(NSString *) _url withMessage:(NSString *) _msg;		// something goes wrong (URL could be nil), malformed url because some variables are missing?
	- (void) tclient_connectionAbortedByUser;
	- (void) tclient_pluginicon_redirectingToURL:(NSString *) _url;
@end

@interface TransportClient : NSObject {
	NSMutableURLRequest					*_request;
	NSURLConnection						*_connection;
	NSMutableDictionary					*_options;
	NSMutableData						*_receivedData;
	BOOL								_connectedAlertSent;
	
	NSObject <TransportClient_Delegate>	*_delegate;
	
}

#pragma mark METHODS
- (void) exec;
- (void) reset;
- (void) abort;

- (void) setDelegate:(NSObject <TransportClient_Delegate>*) delegate;

#pragma mark SETUP DATA
- (void) setAuthentication:(NSString *) authentication;
- (void) setUsername:(NSString *) username andPassword:(NSString *) password;
- (void) setCharset:(NSString *) charset;
- (void) setURL:(NSString *) url;
- (void) setPostData:(NSString *) data;
- (void) setReferrer:(NSString *) referrer;
- (void) setUserAgent:(NSString *) userAgent;
- (void) setCookies:(NSArray *) _cookiesList;

#pragma mark PRIVATE METHODS
- (void) _applyCookiesToRequestAtAddress:(NSString *) addr;

@end
