/*globals define*/

var mainsection1 = {
	label: 'Export Settings',
	type: 'items',
	component: 'expandable-items',
	items: {
		i1: {
			label: 'Objects',
			type: 'items',
			items: [
				{
					 label: 'ObjectId',
					 type: 'string',
					 expression: 'optional',
					 ref: 'exportObjectId',
					 defaultValue: ''
				},{
					 label: 'Width (px)',
					 type: 'number',
					 expression: 'optional',
					 ref: 'exportWidth',
					 defaultValue: 400
				},{
					 label: 'Height (px)',
					 type: 'number',
					 expression: 'optional',
					 ref: 'exportHeight',
					 defaultValue: 300
				} /*,
				{
					label: '1.1.2 alignment',
					type: 'string',
					component: 'item-selection-list',
					icon: true,
					horizontal: true,
					ref: 'setting_1_1_2',
					defaultValue: 'left',
					items: [{
						value: 'left',
						component: 'icon-item',
						icon: 'M'
					},{
						value: 'center',
						icon: 'O',
						component: 'icon-item'
					},{
						value: 'right',
						icon: 'N',
						component: 'icon-item'
					}]
				}*/
			]
		} 
	}
};
/*
function newGuid() {
	var guid="";
	for (var i=0; i<36; i++) {
		guid += (i==8||i==13||i==18||i==23)?'-':Math.floor(Math.random()*0xF).toString(0xF);
	}
	return guid;
}
*/	 

define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );

	return {
/*		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 50
				}]
			}
		}, */
		definition: {
			type: "items",
			component: "accordion",
			items: {
/*				dimensions: {
					uses: "dimensions",
					min: 1
				},
				measures: {
					uses: "measures",
					min: 0
				},
				sorting: {
					uses: "sorting"
				},*/
				settings: {
					uses: "settings"
				},
				mysection: mainsection1
			}
		},
/*		snapshot: {
			canTakeSnapshot: true
		}, */
		paint: function ( $element, layout ) {
			var html = "<div>";
			var self = this;
			var ownId = this.options.id;
			var app = qlik.currApp(this);
			var enigma = app.model.enigmaModel;
			var localeInfo = app.model.layout.qLocaleInfo;
			//console.log('locale', localeInfo);
			//console.log('layout', layout);
			html += "</div>";
			//add 'more...' button
			html += '<button id="btn1_' +ownId + '" class="lui-button">Export</button>';
			$element.html( html );
			$element.find("#btn1_"+ownId).on( "click", function () {
				//var exportSettings = { documentSize: 'A4', aspectRatio: 2, orientation: "landscape" };
				var exportImgSettings = { imageType: 'JPG', height: layout.exportHeight, width: layout.exportWidth };
				//var requestId = newGuid();
				// https://help.qlik.com/en-US/sense-developer/February2019/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/VisualizationAPI/exportImg-method.htm
				app.visualization.get (layout.exportObjectId).then(function(vis) {
					console.log('Found object ' + layout.exportObjectId + ', now exporting ...');
					console.log(vis);
					return vis.exportImg(exportImgSettings);
				}).then(function (result) {
					console.log('Image download link: ', result);
				}).catch(function(err){
					console.log(err);
				});
			});
			return qlik.Promise.resolve();
		}
	};
} );
