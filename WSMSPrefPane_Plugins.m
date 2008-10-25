//
//  WSMSPrefPane_Plugins.m
//  websmslib
//
//  Created by malcom on 9/6/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WSMSPrefPane_Plugins.h"
#import "WSMS_PrefsController.h"

@implementation WSMSPrefPane_Plugins

- (void) awakeFromNib {
	[tbl_installedPlugins setDelegate: self];
	[tbl_installedPlugins setDataSource: self];
	[tbl_installedPlugins setTarget: self];
	[self reloadPluginsList];
}
				   
- (void) reloadPluginsList {
	[_pluginList release];
	_pluginList = [[NSMutableArray alloc] initWithArray: [[[WebSMSPluginManager sharedManager] getPluginsList] allValues]]; 
}

- (int)numberOfRowsInTableView:(NSTableView *)aTableView {
	return [_pluginList count];
}


- (id)tableView:(NSTableView *)aTableView objectValueForTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	NSString *key = [aTableColumn identifier];
	
	if ([key isEqualToString: @"name"])
		return [[_pluginList objectAtIndex:rowIndex] name];

	if ([key isEqualToString: @"version"])
		return [[_pluginList objectAtIndex:rowIndex] version];

	if ([key isEqualToString: @"mantainer"])
		if ([[_pluginList objectAtIndex:rowIndex] getAuthor] != nil)
			return [[_pluginList objectAtIndex:rowIndex] getAuthor];
		else return NSLocalizedStringFromTable(@"UI_NoPluginMantainer",@"Dialogs",@"");
	
	if ([key isEqualToString: @"lastupdate"]) {
		NSDate *uDate = [[_pluginList objectAtIndex:rowIndex] getLastUpdateDate];
		if (uDate == nil) return NSLocalizedStringFromTable(@"UI_UpdateDate_Never",@"Dialogs",@"");
		else {
			NSCalendarDate *today = [NSCalendarDate date];
			NSCalendarDate *dt = [NSCalendarDate dateWithTimeIntervalSince1970: [uDate timeIntervalSince1970]];
			if ([dt dayOfYear] == [today dayOfYear] && [dt monthOfYear] == [today monthOfYear] && [dt yearOfCommonEra] == [today yearOfCommonEra])
				return NSLocalizedStringFromTable(@"UI_UpdateDate_Today",@"Dialogs",@"");
			else
				return [NSString stringWithFormat: NSLocalizedStringFromTable(@"UI_UpdateDate_Date",@"Dialogs",@""),[dt descriptionWithCalendarFormat:@"%m/%d/%y"]];
		}
	}
	
	return nil;
}

- (void)tableView:(NSTableView *)aTableView willDisplayCell:(id)aCell forTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {	
}

- (BOOL)tableView:(NSTableView *)aTableView shouldEditTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	return NO;
}

- (IBAction) btn_checkUpdates:(id) sender {
	[NSApp beginSheet: wnd_downloadWindow 
			modalForWindow: [[WSMS_PrefsController sharedPrefsWindowController] window]
			modalDelegate:self 
			didEndSelector:NULL 
			contextInfo:nil];
	
	_currentUpdatingIndex = -1;
	[down_prg_statusBar setIndeterminate: NO];
	[down_prg_statusBar setMaxValue: [_pluginList count]];
	[down_prg_statusBar setMinValue: 0.0];
	[down_prg_statusBar setDoubleValue: 0.0];
	
	[self _startAnotherPluginCheck];
}

- (void) _startAnotherPluginCheck {
	_currentUpdatingIndex++;
	if (_currentUpdatingIndex < [_pluginList count]) {
		WebSMSPlugin *plug = [_pluginList objectAtIndex: _currentUpdatingIndex];
		[plug setUpdateCheckDelegate: self];

		
		[down_fld_statusField setStringValue: [NSString stringWithFormat: 
											NSLocalizedStringFromTable(@"UI_Update_CheckUpdatesFor",@"Dialogs",@""),
										   [[_pluginList objectAtIndex: _currentUpdatingIndex] name]]];
		[down_fld_summaryField setStringValue: [NSString stringWithFormat: 
											NSLocalizedStringFromTable(@"UI_Update_Summary",@"Dialogs",@""),
										    _updatedPlugins,_failedPlugins]];
		[plug update];

		[down_prg_statusBar incrementBy: 1.0];
	} else {
		[NSApp endSheet: wnd_downloadWindow];
		[wnd_downloadWindow orderOut:nil];
		
		[self reloadPluginsList];
	}
}

- (void) websms_updateplugin_startConnectingFor:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message:@"Start connecting for %@",[_plugin name]];
	
}

- (void) websms_updateplugin_cannotConnect:(NSString *) update_url forPlugin:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message:@"Cannot connect to update for %@",[_plugin name]];

	_failedPlugins++;
	[self _startAnotherPluginCheck];
}

- (void) websms_updateplugin_receivingDataFor:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message:@"Receiving data for %@",[_plugin name]];

	[down_fld_statusField setStringValue: [NSString stringWithFormat: 
											NSLocalizedStringFromTable(@"UI_Update_ReceivingData",@"Dialogs",@""),
										   [_plugin name]]];
}

- (void) websms_updateplugin_noUpdatesAvailable:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message:@"No new updates for for %@",[_plugin name]];

	[self _startAnotherPluginCheck];
}

- (void) websms_updateplugin_pluginUpdatedTo:(NSString *) _newversion for:(WebSMSPlugin *) _plugin {
	_updatedPlugins++;
	[[MCDebug sharedDebug] printDebug: self message:@"Plugin updated for %@",[_plugin name]];

	[_plugin setLastUpdate: [NSDate date]];
	
	[self _startAnotherPluginCheck];
}

- (void) websms_updateplugin_cannotSaveNewPlugin:(WebSMSPlugin *) _plugin {
	[[MCDebug sharedDebug] printDebug: self message:@"Error saving new update for %@",[_plugin name]];
	_failedPlugins++;
	
	[self _startAnotherPluginCheck];
}


@end
