//
//  NSHideSuggestionField.m
//  websmslib
//
//  Created by malcom on 10/3/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "NSHideSuggestionField.h"


@implementation NSHideSuggestionField

- (BOOL)control:(NSControl *)control textShouldBeginEditing:(NSText *)fieldEditor {
	[((NSTextField*)self) setStringValue:@""];
	return YES;
}

@end
