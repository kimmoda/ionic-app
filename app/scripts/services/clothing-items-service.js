'use strict';
/* **********************************************************************
 * @author: ${USER}
 * @date  : ${DATE}
 * @name Outfitpic.service:ClothingItems
 *
 * **********************************************************************
 * @copyright All rights reserved by Outfitpic Inc 2015
 * **********************************************************************
 * @ngdoc service
 * @description Clothing item service to return items they can select
 *
 *
 */

angular.module('Outfitpic.Service.ClothingItems', [])
    .factory('ClothingItems', ['MasterDataService', 'PopUpService',
      function (MasterDataService, PopUpService) {
        return {
          returnWomenItems: function(){
            var womenItems = [{
              'itemName': 'Accessories',
              'itemIcon': 'accessories',
              'sex': 'female'
            },{
              'itemName': 'Beachwear',
              'itemIcon': 'beachwear',
              'sex': 'female'
            }, {
              'itemName': 'Coat',
              'itemIcon': 'coat',
              'sex': 'female'
            }, {
              'itemName': 'Dress',
              'itemIcon': 'dress',
              'sex': 'female'
            }, {
              'itemName': 'Footwear',
              'itemIcon': 'footwear',
              'sex': 'female'
            }, {
              'itemName': 'Jacket',
              'itemIcon': 'jacket',
              'sex': 'female'
            }, {
              'itemName': 'Knitwear',
              'itemIcon': 'knitwear',
              'sex': 'female'
            }, {
              'itemName': 'Shorts',
              'itemIcon': 'short',
              'sex': 'female'
            }, {
              'itemName': 'Skirts',
              'itemIcon': 'skirt',
              'sex': 'female'
            }, {
              'itemName': 'Suit',
              'itemIcon': 'suit',
              'sex': 'female'
            }, {
              'itemName': 'Top',
              'itemIcon': 'top',
              'sex': 'female'
            }, {
              'itemName': 'Trousers',
              'itemIcon': 'trousers',
              'sex': 'female'
            }
            ];
            return womenItems;
          },

          returnMenItems : function(){
            var menItems = [{
              'itemName': 'Accessories',
              'itemIcon': 'accessories',
              'sex': 'male'
            }, {
              'itemName': 'Beachwear',
              'itemIcon': 'beachwear',
              'sex': 'male'
            }, {
              'itemName': 'Coat',
              'itemIcon': 'coat',
              'sex': 'male'
            }, {
                'itemName': 'Footwear',
                'itemIcon': 'footwear',
                'sex': 'male'
            }, {
              'itemName': 'Jacket',
              'itemIcon': 'jacket',
              'sex': 'male'
            }, {
              'itemName': 'Shirt',
              'itemIcon': 'shirt',
              'sex': 'male'
            }, {
              'itemName': 'Shorts',
              'itemIcon': 'short',
              'sex': 'male'
            }, {
              'itemName': 'Suit',
              'itemIcon': 'suit',
              'sex': 'male'
            }, {
              'itemName': 'Sweater',
              'itemIcon': 'sweater',
              'sex': 'male'
            }, {
              'itemName': 'Trousers',
              'itemIcon': 'trousers',
              'sex': 'male'
            }, {
              'itemName': 'T-Shirt',
              'itemIcon': 'tshirt',
              'sex': 'male'
            }, {
              'itemName': 'Hat',
              'itemIcon': 'hat',
              'sex': 'male'
            }
            ];
            return menItems;
          },

          returnBrands : function(query){
            var brandItems = MasterDataService.getBrands();
            var returnValue = {items: []};
            brandItems.$loaded().then(function (itemsArray) {
              itemsArray.forEach(function (item) {
                if (item.companyName.indexOf(query) > -1) {
                  returnValue.items.push(item);
                }
              });
            }).catch(function (error) {
              PopUpService.errorPopup(error);
            });
            return returnValue;
          },


          returnSetupBrands: function(){
            var setupBrands = [{
              'brandName': 'Adidas',
              'brandIcon': 'adidas'
            }, {
              'brandName': 'Armani Exchange',
              'brandIcon': 'armaniexchange'
            }, {
              'brandName': 'Tommy Hilfiger',
              'brandIcon': 'tommyhilfiger'
            }, {
              'brandName': 'Nike',
              'brandIcon': 'nike'
            }, {
              'brandName': 'Gucci',
              'brandIcon': 'gucci'
            }, {
              'brandName': 'Supreme',
              'brandIcon': 'supreme'
            }, {
              'brandName': 'Versace',
              'brandIcon': 'versace'
            }, {
              'brandName': 'Top Man',
              'brandIcon': 'topman'
            }, {
              'brandName': 'River Island',
              'brandIcon': 'riverisland'
            }, {
              'brandName': 'Chanel',
              'brandIcon': 'chanel'
            }, {
              'brandName': 'Ralph Lauren',
              'brandIcon': 'ralphlauren'
            }];

            return setupBrands;
          }

        };
      }]);
