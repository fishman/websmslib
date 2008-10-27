//
//  WebSMSAppManager.h
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#else
	#import <Foundation/Foundation.h>
#endif

#define people_data_name @"name"
#define people_data_phone @"phone"

#define ACCOUNTS_GROUP					@"ACCOUNTS_GROUP"
#define PREFS_RECENTS					@"recents_history"

@class WebSMSLibrary;
@interface WebSMSAppManager : NSObject {

}

+ (WebSMSAppManager *) sharedManager;

#pragma mark ACCOUNTS MANAGER
- (NSMutableDictionary *) accountsListPreferences;
- (void) saveAccountsListPreferences:(NSMutableDictionary *) _pref;
- (void) removeAccountNamed:(NSString *) _account;
- (NSArray *) getAllAccounts;
- (BOOL) saveUsername:(NSString *) _user andPass:(NSString *) _pass toAccountNamed:(NSString *) _aname forPluginNamed:(NSString *) _pName;
- (NSDictionary *) getAccountNamed:(NSString *) _account;

#pragma mark RECENT DESTIONATIONS
- (NSMutableArray *) getRecentDestinations;
- (void) addToRecentsDestinations:(NSDictionary *) _data;
- (void) _saveRecentsDestsPreferences:(NSMutableArray *) _pref;

#pragma mark PHONES LINK
- (void) saveLinkBetweenNumber:(NSString *) _num andAccountName:(NSString *) _ac;
- (NSString *) getAccountNameForNumber:(NSString *) _num;

@end
