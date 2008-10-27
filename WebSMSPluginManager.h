//
//  WebSMSPluginManager.h
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/29/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//
#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#endif
#ifdef IPHONE
	#import <Foundation/Foundation.h>
#endif
	
#import "WebSMSLibrary.h"

@interface WebSMSPluginManager : NSObject <WebSMSPlugin_UpdateCheckingDelegate> {
	NSMutableDictionary		*_pluginsList;
}

+ (WebSMSPluginManager *) sharedManager;
- (void) readPluginsFromFolder:(NSString *) _folderPath resetList:(BOOL) _reset;

#pragma mark WORKING WITH PLUGINS
- (NSArray *) pluginServices;
- (WebSMSPlugin *) getPluginWithName:(NSString *) _name;
- (WebSMSPlugin *) getNewIstanceOfPluginWithName:(NSString *) _name;
- (NSDictionary *) getPluginsList;

#pragma mark ASSISTANT
//- (NSString *) getPluginNameForDestinationNumber:(NSString *) _dest store:(BOOL) _save;
//- (NSString *) suitablePluginNameForDestinationNumber:(NSString *) _dest;

- (void) setPluginUpdateCheckDelegate:(NSObject <WebSMSPlugin_UpdateCheckingDelegate> *) _delegate;

#pragma mark PRIVATE
- (BOOL) _checkExistPluginFileName:(NSString *) _name atPath:(NSString *) fpath;

@end
