//
//  WebSMSPluginManager.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/29/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WebSMSPluginManager.h"

id _sharedPluginManager;

@implementation WebSMSPluginManager


+ (WebSMSPluginManager *) sharedManager {
	if (! _sharedPluginManager )
        [[self alloc] init];
    return _sharedPluginManager;
}
 
- (id) init {
    if ( _sharedPluginManager ) {
       return _sharedPluginManager;
    } else {
		self = [super init];
		
		// read the default location
		[self readPluginsFromFolder: [NSString stringWithFormat: @"%@/%@",[[NSBundle mainBundle] resourcePath], @"plugins"] resetList: NO];
		
		_sharedPluginManager = self;
		return _sharedPluginManager;
    }
}

- (void) readPluginsFromFolder:(NSString *) _folderPath resetList:(BOOL) _reset {
	if (_reset || _pluginsList == nil) {
		[_pluginsList release];
		_pluginsList = [[NSMutableDictionary alloc] init];
	}
	
	BOOL isDir;
	if ([[NSFileManager defaultManager] fileExistsAtPath: _folderPath isDirectory: &isDir] && isDir) {
		NSArray *list = [[NSFileManager defaultManager] directoryContentsAtPath: _folderPath];
		
		int k;
		for (k=0; k < [list count]; k++) {
			NSString *cFileName = [list objectAtIndex: k];
			NSString *fullPath = [NSString stringWithFormat:@"%@/%@",_folderPath,cFileName];
			if ([[fullPath pathExtension] isEqualToString: @"plist"]) {
				
				// can insert can replace old plugin when duplicate is a newer version or when there is not any duplicate
				BOOL canInsert = [self _checkExistPluginFileName: [fullPath lastPathComponent] atPath: fullPath];
				if (canInsert) { // ok it does not exist in list or this version is newer than the one in list
					WebSMSPlugin *plug = [[WebSMSPlugin alloc] initWithConfigurationFile: fullPath];
					[_pluginsList setObject: [plug autorelease] forKey: [fullPath lastPathComponent]];
				}
			}
		}
	}
	
	// associate with standard plugin delegate
	[self setPluginUpdateCheckDelegate: self];
	
	[[MCDebug sharedDebug] printDebug: self message: @"%d plugins listed in %@",[_pluginsList count],_folderPath];
}

- (BOOL) _checkExistPluginFileName:(NSString *) _name atPath:(NSString *) fpath {
	if ([_pluginsList objectForKey: _name] != nil) {
		WebSMSPlugin *duplicate = [[WebSMSPlugin alloc] initWithConfigurationFile: fpath];		
		BOOL replace = [[_pluginsList objectForKey: _name] isOlderThan: duplicate];
		[duplicate release];
		
		if (replace)
			[[MCDebug sharedDebug] printDebug: self message: @"Plugin [%@] at path [%@] is the lastest version [%@ : %@]. Replacing the old one in list",
																[fpath lastPathComponent],
																[duplicate version],
																[[_pluginsList objectForKey: _name] version],
																fpath];
		else
			[[MCDebug sharedDebug] printDebug: self message: @"Duplicate plugin ignored (same version %@): %@",
																[duplicate version],
																[fpath lastPathComponent]];
		
		return replace;
	} else {
		[[MCDebug sharedDebug] printDebug: self message: @"Adding plugin %@",[fpath lastPathComponent]];
		return YES;
	}
}

- (NSArray *) pluginServices {
	NSMutableArray *list = [[NSMutableArray alloc] init];
	int k;
	NSArray *allValues = [_pluginsList allValues];
	for (k= 0; k < [allValues count]; k++) {
		WebSMSPlugin *cPlugin = [allValues objectAtIndex: k];
		[list addObject: [cPlugin name]];
	}
	[list sortUsingSelector: @selector(compare:)];
	return [list autorelease];
}

- (WebSMSPlugin *) getNewIstanceOfPluginWithName:(NSString *) _name {
	WebSMSPlugin *_shared = [self getPluginWithName: _name];
	if (_shared == nil) return nil;
	WebSMSPlugin *_single = [[WebSMSPlugin alloc] initWithConfigurationFile: [_shared pathToFile]];
	return [_single autorelease];
}

- (WebSMSPlugin *) getPluginWithName:(NSString *) _name {
	int k;
	NSArray *allValues = [_pluginsList allValues];
	for (k= 0; k < [allValues count]; k++) {
		WebSMSPlugin *cPlugin = [allValues objectAtIndex: k];
		if ([[cPlugin name] isEqualToString: _name]) {
			return cPlugin;
		}
	}
	return nil;
}

- (void) setPluginUpdateCheckDelegate:(NSObject <WebSMSPlugin_UpdateCheckingDelegate> *) _delegate {
	int k;
	NSArray *allValues = [_pluginsList allValues];
	for (k= 0; k < [allValues count]; k++) {
		WebSMSPlugin *cPlugin = [allValues objectAtIndex: k];
		[cPlugin setUpdateCheckDelegate: _delegate];
	}
}

- (NSDictionary *) getPluginsList {
	return _pluginsList;
}

#pragma mark DELEGATE FOR UPDATE PLUGINS SERVICE

- (void) websms_updateplugin_startConnectingFor:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message: @"Connecting for plugin [%@]...",[_plugin name]];	
}

- (void) websms_updateplugin_cannotConnect:(NSString *) update_url forPlugin:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message: @"Cannot update plugin [%@] at url: [%@]",[_plugin name],update_url];
}

- (void) websms_updateplugin_receivingDataFor:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message: @"Updating plugin [%@]....",[_plugin name]];
}

- (void) websms_updateplugin_noUpdatesAvailable:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message: @"You have the last version of plugin [%@]",[_plugin name]];
}

- (void) websms_updateplugin_pluginUpdatedTo:(NSString *) _newversion for:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message: @"Plugin [%@] updated at version [%@]",_newversion,[_plugin name]];
}

- (void) websms_updateplugin_cannotSaveNewPlugin:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message: @"Cannot save new plugin [%@]",[_plugin name]];
}

@end
