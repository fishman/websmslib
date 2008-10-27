//
//  WebSMSPlugin.h
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


#define _plugin_name				@"name"
#define _plugin_authentication		@"authentication"
#define _plugin_username			@"username"
#define _plugin_password			@"password"
#define _plugin_charset				@"charset"
#define _plugin_action				@"action"
#define _plugin_flags				@"flags"
#define _plugin_cookies				@"cookies"
#define _plugin_cookie_name			@"name"
#define _plugin_cookie_value		@"value"
#define _plugin_data				@"data"
#define _plugin_check				@"check"
#define _plugin_check_match			@"match"
#define _plugin_check_name			@"name"
#define _plugin_check_reason		@"reason"
#define _plugin_check_vars			@"vars"
#define _plugin_check_index			@"index"
#define _plugin_check_escape		@"escape"
#define _plugin_captcha				@"captcha"
#define _plugin_successmarker		@"success_marker"
#define _plugin_referrer			@"referrer"
#define _plugin_availabilityCheck	@"availabilityCheck"
#define _plugin_version				@"version"
#define _plugin_update_url			@"update_url"
#define _plugin_ico					@"IconRef"
#define _plugin_mainsite			@"main_site"
//#define _plugin_author				@"author"
#define _plugin_lastUpdate			@"lastUpdate"
#define _plugin_maxChars			@"max_message_length"
#define _plugin_delay				@"delay"

#define _plugin_auth_user			@"username"
#define _plugin_auth_pass			@"password"
#define _plugin_auth_accountname	@"accountname"
#define _plugin_auth_plugin			@"plugin"

#define _plugin_report_fields		@"report_contacts"
#define _plugin_report_email		@"mail"
#define _plugin_report_name			@"name"

@class WebSMSPlugin;
/*
 * You should implement this delegate in your app in order to check the update
 * status for your plugins when you use -update method.
 * The default delegate for each plugin is set at init to WebSMSPluginManager class.
*/
@protocol WebSMSPlugin_UpdateCheckingDelegate
- (void) websms_updateplugin_startConnectingFor:(WebSMSPlugin *) _plugin;									// connection to server in progress
- (void) websms_updateplugin_cannotConnect:(NSString *) update_url forPlugin:(WebSMSPlugin *) _plugin;		// can't connect to server
- (void) websms_updateplugin_receivingDataFor:(WebSMSPlugin *) _plugin;										// ok downloading data from server
- (void) websms_updateplugin_noUpdatesAvailable:(WebSMSPlugin *) _plugin;									// no new version of this plugin is available
- (void) websms_updateplugin_pluginUpdatedTo:(NSString *) _newversion for:(WebSMSPlugin *) _plugin;			// well! your plugin was updated successfully
- (void) websms_updateplugin_cannotSaveNewPlugin:(WebSMSPlugin *) _plugin;									// something goes wrong, cannot save plugin (permission on disk?)
@end

@protocol WebSMSPlugin_FavIconCheck
- (void) websms_pluginicon_cannotDownload;
- (void) websms_pluginicon_done:(NSData *) _icon;
@end

@interface WebSMSPlugin : NSObject <WebSMSPlugin_FavIconCheck> {
	NSMutableDictionary								*_data;						// plugin data
	NSString										*_pathToFile;				// location of plugin on disk
	NSString										*_accountName;
	
	// version checking
	NSURLConnection									*_updateConnection;
	NSObject <WebSMSPlugin_UpdateCheckingDelegate>	* _delegate;
	NSMutableData									*_receivedData;
	BOOL											 _connectedAlertSent;
	
	NSURLConnection									*_favIconConnection;
	NSObject <WebSMSPlugin_FavIconCheck>			*_favIconDelegate;
	NSMutableData									*_receivedFavIconData;
	BOOL											 _downloadFavIconInProgress;
}

#pragma mark initWithConfigurationFile
- (id) initWithConfigurationFile:(NSString *) _path;
- (NSString *) pathToFile;
- (void) setAccountName:(NSString *) _name;
- (NSString *) accountName;

#pragma mark WORKING WITH STEPS
- (int) steps;
- (NSDictionary *) stepAtIndex:(int) _idx;
- (void) setUpdateCheckDelegate:(NSObject <WebSMSPlugin_UpdateCheckingDelegate> *) delegate;

#pragma mark WORKING WITH FAVICON SERVICE ICON
- (void) setFavIconDelegate:(NSObject <WebSMSPlugin_FavIconCheck> *) delegate;

#pragma mark INFO
- (int) charset;
- (NSString *) name;
- (NSDictionary *) data;
- (NSData *) serviceIcon;
- (void) setServiceIcon:(NSData *) _icon;
- (void) writeToFile;
- (NSString *) getAuthor;
- (int) maxCharsAllowed;
- (NSDictionary *) reportContacts;

#pragma mark AUTH DATA IN PREF
- (BOOL) saveDataInUserPreferences:(NSString *) _username pass:(NSString *) _pass;
- (NSDictionary *) getAuthdataFromPreferences;

#pragma mark update_url
- (NSString *) version;
- (BOOL) isOlderThan:(WebSMSPlugin *) _compare;
- (BOOL) update;
- (BOOL) isUpdating;
- (NSDate *) getLastUpdateDate;
- (void) setLastUpdate:(NSDate *) _date;
- (NSStringEncoding ) usedEncoding;

#pragma mark PRIVATE METHODS
+ (BOOL) _saveDataInUserPreferences:(NSString *) _username pass:(NSString *) _pass accountName:(NSString *) _acname plugInName:(NSString *) _pname;
- (void) _downloadFavIconViaHTML:(NSString*) _firstPageURL;

@end
