//
//  WebSMSAppManager.m
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WebSMSAppManager.h"
#import "WebSMSPluginManager.h"


id _sharedAppManager;

@implementation WebSMSAppManager

+ (WebSMSAppManager *) sharedManager {
	if (! _sharedAppManager )
        [[self alloc] init];
    return _sharedAppManager;
}

- (id) init {
    if ( _sharedAppManager ) {
       return _sharedAppManager;
    } else {
		self = [super init];
				
		_sharedAppManager = self;
		return _sharedAppManager;
    }
}

- (NSArray *) getAllAccounts {
	return [[[WebSMSAppManager sharedManager] accountsListPreferences] allValues];
}

- (BOOL) saveUsername:(NSString *) _user andPass:(NSString *) _pass toAccountNamed:(NSString *) _aname forPluginNamed:(NSString *) _pName {
	return [WebSMSPlugin _saveDataInUserPreferences: _user pass: _pass accountName: _aname plugInName: _pName];
}

- (void) removeAccountNamed:(NSString *) _account {
	NSMutableDictionary *_list = [[WebSMSAppManager sharedManager] accountsListPreferences];
	[_list removeObjectForKey: _account];
	[self saveAccountsListPreferences: _list];
}

- (NSMutableDictionary *) accountsListPreferences {
	NSData *_rdata =  [[NSUserDefaults standardUserDefaults] objectForKey: ACCOUNTS_GROUP];
	NSMutableDictionary *_accountsGroupsList = nil;
	
	if (_rdata == nil) 
		_accountsGroupsList = [[[NSMutableDictionary alloc] init] autorelease];
	else {
		// get the dictionary with grouped accounts
		_accountsGroupsList = [[NSUnarchiver unarchiveObjectWithData: _rdata] retain];
		[self saveAccountsListPreferences: _accountsGroupsList];
	}
	
	return [_accountsGroupsList autorelease];
}

- (void) saveAccountsListPreferences:(NSMutableDictionary *) _pref {
	NSData *writtenData = [[NSData alloc] initWithData: [NSArchiver archivedDataWithRootObject: _pref]];
	[[NSUserDefaults standardUserDefaults] setObject: writtenData
												  forKey:ACCOUNTS_GROUP];
	[writtenData release];
	[[NSUserDefaults standardUserDefaults] synchronize];
}

- (NSDictionary *) getAccountNamed:(NSString *) _account {
	NSMutableDictionary *_list = [[WebSMSAppManager sharedManager] accountsListPreferences];
	return [_list objectForKey: _account];
}

- (NSMutableArray *) getRecentDestinations {
	NSData *_rdata =  [[NSUserDefaults standardUserDefaults] objectForKey: PREFS_RECENTS];
	NSMutableArray *_recentsDests = nil;
	
	if (_rdata == nil) 
		_recentsDests = [[[NSMutableArray alloc] init] autorelease];
	else {
		// get the dictionary with grouped accounts
		_recentsDests = [[NSUnarchiver unarchiveObjectWithData: _rdata] retain];
		[self _saveRecentsDestsPreferences: _recentsDests];
	}
	
	return [_recentsDests autorelease];
}

- (void) addToRecentsDestinations:(NSDictionary *) _data {
	NSMutableArray *list = [self getRecentDestinations];
	int k;
	BOOL _found = NO;
	for (k=0; k < [list count]; k++) {
		NSDictionary *cItem = [list objectAtIndex: k];
		if ([[cItem objectForKey: people_data_phone] rangeOfString: [_data objectForKey: people_data_phone]].location != NSNotFound) {
			_found = YES;
			break;
		}
	}
	
	if (!_found)
		[list addObject: _data];
	
	[self _saveRecentsDestsPreferences: list];
}

- (void) _saveRecentsDestsPreferences:(NSMutableArray *) _pref {
	NSData *writtenData = [[NSData alloc] initWithData: [NSArchiver archivedDataWithRootObject: _pref]];
	[[NSUserDefaults standardUserDefaults] setObject: writtenData
												  forKey:PREFS_RECENTS];
	[writtenData release];
	[[NSUserDefaults standardUserDefaults] synchronize];
}

- (void) saveLinkBetweenNumber:(NSString *) _num andAccountName:(NSString *) _ac {
	if ([[[NSUserDefaults standardUserDefaults] objectForKey: @"remember_accounts"] boolValue]) {
		NSData *_data = [[NSUserDefaults standardUserDefaults] objectForKey: @"phone_links"];
		NSMutableDictionary *_linkList = nil;
		if (_data == nil)
			_linkList = [[NSMutableDictionary alloc] init];
		else _linkList = [[NSMutableDictionary alloc] initWithDictionary: [NSUnarchiver unarchiveObjectWithData: _data]];
		
		[_linkList setObject: _ac forKey: [_num trimNumber]];
		
		[[NSUserDefaults standardUserDefaults] setObject: [NSArchiver archivedDataWithRootObject: _linkList]
												  forKey:@"phone_links"];
		[_linkList release];
	}
}

- (NSString *) getAccountNameForNumber:(NSString *) _num {
	if ([[[NSUserDefaults standardUserDefaults] objectForKey: @"remember_accounts"] boolValue] == NO) return nil;
	
	NSData *_data = [[NSUserDefaults standardUserDefaults] objectForKey: @"phone_links"];
	if (_data == nil) return nil;
	NSMutableDictionary *_linkList = [[NSMutableDictionary alloc] initWithDictionary: [NSUnarchiver unarchiveObjectWithData: _data]];
	
	NSString *name = nil;
	if ([_linkList objectForKey: [_num trimNumber]])
		name = [[NSString alloc] initWithString: [_linkList objectForKey: [_num trimNumber]]];
	
	[_linkList release]; return name;
}

@end
