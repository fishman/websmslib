//
//  DragDropImageView.h
//  PimpMyDock
//
//  Created by malcom on 11/6/07.
//  Copyright 2007 __MyCompanyName__. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@protocol DragAndDropImageView_Protocol
	- (void) addPDFDocuments:(NSArray *) _paths;
@end 

@interface DragDropImageView : NSImageView {
	id <DragAndDropImageView_Protocol>	ass_delegate;
}

@property (assign) id <DragAndDropImageView_Protocol>	ass_delegate;

@end
