
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/modules/plaza/script/prefab/enterRoom/ddzentry.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '1a770qp14JB+rQRzawSpZcj', 'ddzentry');
// modules/plaza/script/prefab/enterRoom/ddzentry.js

"use strict";

glGame.baseclass.extend({
  properties: {
    goldCount: cc.Label,
    recordPrefab: cc.Prefab,
    rulePrefab: cc.Prefab,
    level: {
      type: cc.Node,
      "default": []
    },
    BGM: {
      type: cc.AudioClip,
      "default": null
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.gameid = 0;
    this.node.zIndex = 20;
    glGame.audio.playBGM(this.BGM);
    glGame.emitter.on(MESSAGE.UI.ROOM_ENTER_SHOW, this.RootNodeShow, this);
    glGame.emitter.on(MESSAGE.UI.ROOM_ENTER_HIDE, this.RootNodeHide, this);
    glGame.emitter.on("updateUserData", this.updateuserInfo, this);
    glGame.emitter.on("nodeRemove", this.click_back, this);
    this.updateuserInfo();
    this.registerEvent();
    this.reqEnterArea();
  },
  onClick: function onClick(name, node) {
    switch (name) {
      case "btn_back":
        this.click_back();
        break;

      case "btn_help":
        this.click_help();
        break;

      case "btn_record":
        this.click_record();
        break;

      case "mycoinInfo":
        this.click_addgold();
        break;

      case "headbg":
        this.click_userinfo();
        break;

      case "btn_chongzhi":
        this.click_addgold();
        break;

      case "primary":
        this.enterGame(99);
        break;

      case "intermediate":
        this.enterGame(1);
        break;

      case "senior":
        this.enterGame(2);
        break;

      case "tuhao":
        this.enterGame(3);
        break;

      case "supremacy":
        this.enterGame(4);
        break;

      case "volvo":
        this.enterGame(5);
        break;

      default:
        console.error("no find button name -> %s", name);
    }
  },

  /**
   * 进入金币场房间
   * @param level 场次类型 1:初级场 2:中级场 3:高级场 4:土豪场 5:至尊场
   */
  enterGame: function enterGame(level) {
    var _this = this;

    glGame.room.reqMyGameState(this.gameID, level).then(function () {
      var gameID = _this.gameID;

      if (_this.gameConfig[level] == null) {
        glGame.panel.showMsgBox('提示', '该房间尚未开放，请尝试其他房间。');
        return;
      }

      if (glGame.user.isTourist()) {
        if (level != 99) {
          glGame.panel.showRegisteredGift(true);
          return;
        }
      }

      if (glGame.user.suspicious == 1 && glGame.user.game == 2 || glGame.user.is_game == 2) {
        glGame.panel.showDialog("", "您的账号数据异常，暂时禁止进入游戏，如有疑问，请联系客服！", function () {
          glGame.panel.showService();
        }, function () {}, "我知道了", "联系客服");
        return;
      }

      if (_this.gameConfig[level].EntranceRestrictions > glGame.user.get("coin")) {
        console.log("这是当前的房间限制", _this.gameConfig);
        var string = " <color=#99C7FF>\u60A8\u7684\u91D1\u5E01\u4E0D\u8DB3\uFF0C\u8BE5\u623F\u95F4\u9700\u8981</c> <color=#ff0000> ".concat(_this.cutFloat(_this.gameConfig[level].EntranceRestrictions), "  </c><color=#99C7FF>\u91D1\u5E01\u624D\u53EF\u4E0B\u6CE8\uFF0C\u662F\u5426\u9A6C\u4E0A\u524D\u5F80\u5145\u503C\uFF1F</c>");
        glGame.panel.showDialog("", string, function () {
          glGame.panel.showShop(100);
        }, function () {}, "取消", "充值");
        return;
      }

      glGame.panel.showJuHua(); // glGame.readyroom.reqExitArea();

      _this.node.runAction(cc.sequence(cc.delayTime(15), cc.callFunc(function () {
        glGame.panel.closeJuHua();
      }))); // TODO
      // reqGoldRoomVerify为旧的进入房间方法，需要先请求验证，再进入房间
      // setGoldRoomInfo 新的进入房间方法，无需验证，设置游戏类型以及房间信息后，直接进入房间
      // if (glGame.enterRoomVerification) {
      //     glGame.room.reqGoldRoomVerify(gameID, level);
      // } else {
      //     glGame.room.setGoldRoomInfo(gameID, level);
      // }


      glGame.room.setGoldRoomInfo(gameID, level);
    });
  },
  //事件监听
  registerEvent: function registerEvent() {
    glGame.emitter.on("goldOnlineNum", this.goldOnlineNum, this);
    glGame.emitter.on("onGameConfig", this.onGameConfig, this);
  },
  //事件销毁
  unregisterEvent: function unregisterEvent() {
    glGame.emitter.off("goldOnlineNum", this);
    glGame.emitter.off("onGameConfig", this);
  },
  RootNodeShow: function RootNodeShow() {
    this.node.active = true;
    this.registerEvent();
    this.reqEnterArea();
  },
  RootNodeHide: function RootNodeHide() {
    this.node.active = false;
    this.unregisterEvent();
  },
  onGameConfig: function onGameConfig(msg) {
    this.gameConfig = msg;
    this.initUI();
  },
  reqEnterArea: function reqEnterArea() {
    this.gameID = glGame.scenetag.DDZ;
    glGame.readyroom.reqEnterArea(glGame.scenetag.DDZ);
  },
  goldOnlineNum: function goldOnlineNum(msg) {
    console.log("这是在线人数的消息", msg);
    var count = this.level.length;

    for (var i = 0; i < count; i++) {
      if (msg[i + 1]) {
        this.level[i].getChildByName("people_num").getComponent(cc.Label).string = msg[i + 1];
      }
    }
  },
  initUI: function initUI() {
    this.node.active = true;
    var configure = this.gameConfig;
    var count = this.level.length;

    for (var i = 1; i < count; i++) {
      this.level[i].getChildByName("dizhulaout").getChildByName("dizhu_num").getComponent(cc.Label).string = this.cutFloat(configure[i].BaseChips);
      this.level[i].getChildByName("zhunrulayout").getChildByName("zhunru_num").getComponent(cc.Label).string = this.cutFloat(configure[i].EntranceRestrictions);
    }
  },
  cutFloat: function cutFloat(value) {
    return Number(value).div(100).toString();
  },

  /**
   * 检查玩家金币是否足够
   * @returns {boolean}
   */
  checkGold: function checkGold(coin, minCion) {
    console.log("金币检测", coin, minCion);

    if (parseInt(coin) < parseInt(minCion)) {
      glGame.panel.showDialog(glGame.i18n.t("USER.GOLDLACK.TITLE"), glGame.i18n.t("USER.GOLDLACK.CONTENT"), function () {
        glGame.panel.showPanelByName("shop");
      }, null);
      return false;
    }

    return true;
  },
  showUserInfo: function showUserInfo() {
    glGame.panel.showRemoteImage(this.Playerhead, glGame.user.get("headURL"));
  },
  updateuserInfo: function updateuserInfo() {
    var coin = glGame.user.get("coin");
    this.goldCount.string = glGame.user.GoldTemp(coin);
  },
  setGameId: function setGameId(gameid) {
    this.gameid = gameid;
  },
  updateBgInfo: function updateBgInfo() {},
  click_userinfo: function click_userinfo() {
    glGame.panel.showPanelByName("userinfo");
  },
  click_addgold: function click_addgold() {
    glGame.panel.showShop(30);
  },
  click_back: function click_back() {
    glGame.readyroom.reqExitArea();
    this.remove();
  },
  click_help: function click_help() {
    var panel = glGame.panel.showPanel(this.rulePrefab);
    panel.zIndex = 30;
  },
  click_record: function click_record() {
    var panel = glGame.panel.showPanel(this.recordPrefab);
    panel.zIndex = 30;
  },
  set: function set(key, value) {
    this[key] = value;
  },
  get: function get(key) {
    return this[key];
  },
  OnDestroy: function OnDestroy() {
    glGame.emitter.off(MESSAGE.UI.ROOM_ENTER_SHOW, this);
    glGame.emitter.off(MESSAGE.UI.ROOM_ENTER_HIDE, this);
    glGame.emitter.off("nodeRemove", this);
    glGame.emitter.off("updateUserData", this);
    this.unregisterEvent();
  } // update (dt) {},

});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcbW9kdWxlc1xccGxhemFcXHNjcmlwdFxccHJlZmFiXFxlbnRlclJvb21cXGRkemVudHJ5LmpzIl0sIm5hbWVzIjpbImdsR2FtZSIsImJhc2VjbGFzcyIsImV4dGVuZCIsInByb3BlcnRpZXMiLCJnb2xkQ291bnQiLCJjYyIsIkxhYmVsIiwicmVjb3JkUHJlZmFiIiwiUHJlZmFiIiwicnVsZVByZWZhYiIsImxldmVsIiwidHlwZSIsIk5vZGUiLCJCR00iLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJnYW1laWQiLCJub2RlIiwiekluZGV4IiwiYXVkaW8iLCJwbGF5QkdNIiwiZW1pdHRlciIsIm9uIiwiTUVTU0FHRSIsIlVJIiwiUk9PTV9FTlRFUl9TSE9XIiwiUm9vdE5vZGVTaG93IiwiUk9PTV9FTlRFUl9ISURFIiwiUm9vdE5vZGVIaWRlIiwidXBkYXRldXNlckluZm8iLCJjbGlja19iYWNrIiwicmVnaXN0ZXJFdmVudCIsInJlcUVudGVyQXJlYSIsIm9uQ2xpY2siLCJuYW1lIiwiY2xpY2tfaGVscCIsImNsaWNrX3JlY29yZCIsImNsaWNrX2FkZGdvbGQiLCJjbGlja191c2VyaW5mbyIsImVudGVyR2FtZSIsImNvbnNvbGUiLCJlcnJvciIsInJvb20iLCJyZXFNeUdhbWVTdGF0ZSIsImdhbWVJRCIsInRoZW4iLCJnYW1lQ29uZmlnIiwicGFuZWwiLCJzaG93TXNnQm94IiwidXNlciIsImlzVG91cmlzdCIsInNob3dSZWdpc3RlcmVkR2lmdCIsInN1c3BpY2lvdXMiLCJnYW1lIiwiaXNfZ2FtZSIsInNob3dEaWFsb2ciLCJzaG93U2VydmljZSIsIkVudHJhbmNlUmVzdHJpY3Rpb25zIiwiZ2V0IiwibG9nIiwic3RyaW5nIiwiY3V0RmxvYXQiLCJzaG93U2hvcCIsInNob3dKdUh1YSIsInJ1bkFjdGlvbiIsInNlcXVlbmNlIiwiZGVsYXlUaW1lIiwiY2FsbEZ1bmMiLCJjbG9zZUp1SHVhIiwic2V0R29sZFJvb21JbmZvIiwiZ29sZE9ubGluZU51bSIsIm9uR2FtZUNvbmZpZyIsInVucmVnaXN0ZXJFdmVudCIsIm9mZiIsImFjdGl2ZSIsIm1zZyIsImluaXRVSSIsInNjZW5ldGFnIiwiRERaIiwicmVhZHlyb29tIiwiY291bnQiLCJsZW5ndGgiLCJpIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJjb25maWd1cmUiLCJCYXNlQ2hpcHMiLCJ2YWx1ZSIsIk51bWJlciIsImRpdiIsInRvU3RyaW5nIiwiY2hlY2tHb2xkIiwiY29pbiIsIm1pbkNpb24iLCJwYXJzZUludCIsImkxOG4iLCJ0Iiwic2hvd1BhbmVsQnlOYW1lIiwic2hvd1VzZXJJbmZvIiwic2hvd1JlbW90ZUltYWdlIiwiUGxheWVyaGVhZCIsIkdvbGRUZW1wIiwic2V0R2FtZUlkIiwidXBkYXRlQmdJbmZvIiwicmVxRXhpdEFyZWEiLCJyZW1vdmUiLCJzaG93UGFuZWwiLCJzZXQiLCJrZXkiLCJPbkRlc3Ryb3kiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkMsTUFBakIsQ0FBd0I7QUFFcEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxTQUFTLEVBQUVDLEVBQUUsQ0FBQ0MsS0FETjtBQUVSQyxJQUFBQSxZQUFZLEVBQUdGLEVBQUUsQ0FBQ0csTUFGVjtBQUdSQyxJQUFBQSxVQUFVLEVBQUdKLEVBQUUsQ0FBQ0csTUFIUjtBQUlSRSxJQUFBQSxLQUFLLEVBQUU7QUFDSEMsTUFBQUEsSUFBSSxFQUFFTixFQUFFLENBQUNPLElBRE47QUFFSCxpQkFBUztBQUZOLEtBSkM7QUFRUkMsSUFBQUEsR0FBRyxFQUFDO0FBQ0FGLE1BQUFBLElBQUksRUFBQ04sRUFBRSxDQUFDUyxTQURSO0FBRUEsaUJBQVE7QUFGUjtBQVJJLEdBRlE7QUFnQnBCO0FBRUFDLEVBQUFBLE1BbEJvQixvQkFrQlg7QUFDTCxTQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLElBQUwsQ0FBVUMsTUFBVixHQUFtQixFQUFuQjtBQUNB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VUFBNUIsQ0FBWjtBQUNBc0MsSUFBQUEsS0FBSyxDQUFDN0IsTUFBTixHQUFlLEVBQWY7QUFDSCxHQXhMbUI7QUF5THBCa0IsRUFBQUEsWUF6TG9CLDBCQXlMTDtBQUNYLFFBQUlXLEtBQUssR0FBRy9DLE1BQU0sQ0FBQytDLEtBQVAsQ0FBYTJELFNBQWIsQ0FBdUIsS0FBS25HLFlBQTVCLENBQVo7QUFDQXdDLElBQUFBLEtBQUssQ0FBQzdCLE1BQU4sR0FBZSxFQUFmO0FBQ0gsR0E1TG1CO0FBOExwQnlGLEVBQUFBLEdBOUxvQixlQThMaEJDLEdBOUxnQixFQThMWHJCLEtBOUxXLEVBOExKO0FBQ1osU0FBS3FCLEdBQUwsSUFBWXJCLEtBQVo7QUFDSCxHQWhNbUI7QUFpTXBCN0IsRUFBQUEsR0FqTW9CLGVBaU1oQmtELEdBak1nQixFQWlNWDtBQUNMLFdBQU8sS0FBS0EsR0FBTCxDQUFQO0FBQ0gsR0FuTW1CO0FBb01wQkMsRUFBQUEsU0FwTW9CLHVCQW9NUjtBQUNSN0csSUFBQUEsTUFBTSxDQUFDcUIsT0FBUCxDQUFlb0QsR0FBZixDQUFtQmxELE9BQU8sQ0FBQ0MsRUFBUixDQUFXQyxlQUE5QixFQUE4QyxJQUE5QztBQUNBekIsSUFBQUEsTUFBTSxDQUFDcUIsT0FBUCxDQUFlb0QsR0FBZixDQUFtQmxELE9BQU8sQ0FBQ0MsRUFBUixDQUFXRyxlQUE5QixFQUE4QyxJQUE5QztBQUNBM0IsSUFBQUEsTUFBTSxDQUFDcUIsT0FBUCxDQUFlb0QsR0FBZixDQUFtQixZQUFuQixFQUFpQyxJQUFqQztBQUNBekUsSUFBQUEsTUFBTSxDQUFDcUIsT0FBUCxDQUFlb0QsR0FBZixDQUFtQixnQkFBbkIsRUFBb0MsSUFBcEM7QUFDQSxTQUFLRCxlQUFMO0FBQ0gsR0ExTW1CLENBMk1wQjs7QUEzTW9CLENBQXhCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJnbEdhbWUuYmFzZWNsYXNzLmV4dGVuZCh7XHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGdvbGRDb3VudDogY2MuTGFiZWwsXHJcbiAgICAgICAgcmVjb3JkUHJlZmFiIDogY2MuUHJlZmFiLFxyXG4gICAgICAgIHJ1bGVQcmVmYWIgOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgbGV2ZWw6IHtcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcclxuICAgICAgICAgICAgZGVmYXVsdDogW11cclxuICAgICAgICB9LFxyXG4gICAgICAgIEJHTTp7XHJcbiAgICAgICAgICAgIHR5cGU6Y2MuQXVkaW9DbGlwLFxyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGxcclxuICAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZWlkID0gMDtcclxuICAgICAgICB0aGlzLm5vZGUuekluZGV4ID0gMjA7XHJcbiAgICAgICAgZ2xHYW1lLmF1ZGlvLnBsYXlCR00odGhpcy5CR00pO1xyXG4gICAgICAgIGdsR2FtZS5lbWl0dGVyLm9uKE1FU1NBR0UuVUkuUk9PTV9FTlRFUl9TSE9XLCB0aGlzLlJvb3ROb2RlU2hvdywgdGhpcyk7XHJcbiAgICAgICAgZ2xHYW1lLmVtaXR0ZXIub24oTUVTU0FHRS5VSS5ST09NX0VOVEVSX0hJREUsIHRoaXMuUm9vdE5vZGVIaWRlLCB0aGlzKTtcclxuICAgICAgICBnbEdhbWUuZW1pdHRlci5vbihcInVwZGF0ZVVzZXJEYXRhXCIsIHRoaXMudXBkYXRldXNlckluZm8sIHRoaXMpO1xyXG4gICAgICAgIGdsR2FtZS5lbWl0dGVyLm9uKFwibm9kZVJlbW92ZVwiLCB0aGlzLmNsaWNrX2JhY2ssIHRoaXMpO1xyXG4gICAgICAgIHRoaXMudXBkYXRldXNlckluZm8oKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoKTtcclxuICAgICAgICB0aGlzLnJlcUVudGVyQXJlYSgpO1xyXG4gICAgfSxcclxuICAgIG9uQ2xpY2sobmFtZSwgbm9kZSkge1xyXG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiYnRuX2JhY2tcIjogdGhpcy5jbGlja19iYWNrKCk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYnRuX2hlbHBcIjogdGhpcy5jbGlja19oZWxwKCk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYnRuX3JlY29yZFwiOiB0aGlzLmNsaWNrX3JlY29yZCgpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm15Y29pbkluZm9cIjogdGhpcy5jbGlja19hZGRnb2xkKCk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaGVhZGJnXCI6IHRoaXMuY2xpY2tfdXNlcmluZm8oKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJidG5fY2hvbmd6aGlcIjogdGhpcy5jbGlja19hZGRnb2xkKCk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicHJpbWFyeVwiOiB0aGlzLmVudGVyR2FtZSg5OSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50ZXJtZWRpYXRlXCI6IHRoaXMuZW50ZXJHYW1lKDEpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInNlbmlvclwiOiB0aGlzLmVudGVyR2FtZSgyKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0dWhhb1wiOiB0aGlzLmVudGVyR2FtZSgzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdXByZW1hY3lcIjogdGhpcy5lbnRlckdhbWUoNCk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidm9sdm9cIjogdGhpcy5lbnRlckdhbWUoNSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBjb25zb2xlLmVycm9yKFwibm8gZmluZCBidXR0b24gbmFtZSAtPiAlc1wiLCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDov5vlhaXph5HluIHlnLrmiL/pl7RcclxuICAgICAqIEBwYXJhbSBsZXZlbCDlnLrmrKHnsbvlnosgMTrliJ3nuqflnLogMjrkuK3nuqflnLogMzrpq5jnuqflnLogNDrlnJ/osarlnLogNTroh7PlsIrlnLpcclxuICAgICAqL1xyXG4gICAgZW50ZXJHYW1lKGxldmVsKSB7XHJcbiAgICAgICAgZ2xHYW1lLnJvb20ucmVxTXlHYW1lU3RhdGUodGhpcy5nYW1lSUQsIGxldmVsKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGdhbWVJRCA9IHRoaXMuZ2FtZUlEO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lQ29uZmlnW2xldmVsXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBnbEdhbWUucGFuZWwuc2hvd01zZ0JveCgn5o+Q56S6JywgJ+ivpeaIv+mXtOWwmuacquW8gOaUvu+8jOivt+WwneivleWFtuS7luaIv+mXtOOAgicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChnbEdhbWUudXNlci5pc1RvdXJpc3QoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxldmVsICE9IDk5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xHYW1lLnBhbmVsLnNob3dSZWdpc3RlcmVkR2lmdCh0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZigoZ2xHYW1lLnVzZXIuc3VzcGljaW91cyA9PSAxICYmZ2xHYW1lLnVzZXIuZ2FtZSA9PSAyICkgfHwgZ2xHYW1lLnVzZXIuaXNfZ2FtZSA9PSAyICl7XHJcbiAgICAgICAgICAgICAgICBnbEdhbWUucGFuZWwuc2hvd0RpYWxvZyhcIlwiLCBcIuaCqOeahOi0puWPt+aVsOaNruW8guW4uO+8jOaaguaXtuemgeatoui/m+WFpea4uOaIj++8jOWmguacieeWkemXru+8jOivt+iBlOezu+Wuouacje+8gVwiLCAoKSA9PiB7IGdsR2FtZS5wYW5lbC5zaG93U2VydmljZSgpIH0sICgpID0+IHt9LCBcIuaIkeefpemBk+S6hlwiLCBcIuiBlOezu+WuouacjVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVDb25maWdbbGV2ZWxdLkVudHJhbmNlUmVzdHJpY3Rpb25zID4gZ2xHYW1lLnVzZXIuZ2V0KFwiY29pblwiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLov5nmmK/lvZPliY3nmoTmiL/pl7TpmZDliLZcIiwgdGhpcy5nYW1lQ29uZmlnKVxyXG4gICAgICAgICAgICAgICAgbGV0IHN0cmluZyA9IGAgPGNvbG9yPSM5OUM3RkY+5oKo55qE6YeR5biB5LiN6Laz77yM6K+l5oi/6Ze06ZyA6KaBPC9jPiA8Y29sb3I9I2ZmMDAwMD4gJHt0aGlzLmN1dEZsb2F0KHRoaXMuZ2FtZUNvbmZpZ1tsZXZlbF0uRW50cmFuY2VSZXN0cmljdGlvbnMpfSAgPC9jPjxjb2xvcj0jOTlDN0ZGPumHkeW4geaJjeWPr+S4i+azqO+8jOaYr+WQpumprOS4iuWJjeW+gOWFheWAvO+8nzwvYz5gXHJcbiAgICAgICAgICAgICAgICBnbEdhbWUucGFuZWwuc2hvd0RpYWxvZyhcIlwiLCBzdHJpbmcsICgpID0+IHsgZ2xHYW1lLnBhbmVsLnNob3dTaG9wKDEwMCkgfSwgKCkgPT4geyB9LCBcIuWPlua2iFwiLCBcIuWFheWAvFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdsR2FtZS5wYW5lbC5zaG93SnVIdWEoKTtcclxuICAgICAgICAgICAgLy8gZ2xHYW1lLnJlYWR5cm9vbS5yZXFFeGl0QXJlYSgpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxyXG4gICAgICAgICAgICAgICAgY2MuZGVsYXlUaW1lKDE1KSxcclxuICAgICAgICAgICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBnbEdhbWUucGFuZWwuY2xvc2VKdUh1YSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICAvLyByZXFHb2xkUm9vbVZlcmlmeeS4uuaXp+eahOi/m+WFpeaIv+mXtOaWueazle+8jOmcgOimgeWFiOivt+axgumqjOivge+8jOWGjei/m+WFpeaIv+mXtFxyXG4gICAgICAgICAgICAvLyBzZXRHb2xkUm9vbUluZm8g5paw55qE6L+b5YWl5oi/6Ze05pa55rOV77yM5peg6ZyA6aqM6K+B77yM6K6+572u5ri45oiP57G75Z6L5Lul5Y+K5oi/6Ze05L+h5oGv5ZCO77yM55u05o6l6L+b5YWl5oi/6Ze0XHJcbiAgICAgICAgICAgIC8vIGlmIChnbEdhbWUuZW50ZXJSb29tVmVyaWZpY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBnbEdhbWUucm9vbS5yZXFHb2xkUm9vbVZlcmlmeShnYW1lSUQsIGxldmVsKTtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgIGdsR2FtZS5yb29tLnNldEdvbGRSb29tSW5mbyhnYW1lSUQsIGxldmVsKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICBnbEdhbWUucm9vbS5zZXRHb2xkUm9vbUluZm8oZ2FtZUlELCBsZXZlbCk7XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAvL+S6i+S7tuebkeWQrFxyXG4gICAgcmVnaXN0ZXJFdmVudCgpIHtcclxuICAgICAgICBnbEdhbWUuZW1pdHRlci5vbihcImdvbGRPbmxpbmVOdW1cIiwgdGhpcy5nb2xkT25saW5lTnVtLCB0aGlzKTtcclxuICAgICAgICBnbEdhbWUuZW1pdHRlci5vbihcIm9uR2FtZUNvbmZpZ1wiLCB0aGlzLm9uR2FtZUNvbmZpZywgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgLy/kuovku7bplIDmr4FcclxuICAgIHVucmVnaXN0ZXJFdmVudCgpIHtcclxuICAgICAgICBnbEdhbWUuZW1pdHRlci5vZmYoXCJnb2xkT25saW5lTnVtXCIsIHRoaXMpO1xyXG4gICAgICAgIGdsR2FtZS5lbWl0dGVyLm9mZihcIm9uR2FtZUNvbmZpZ1wiLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBSb290Tm9kZVNob3coKXtcclxuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoKTtcclxuICAgICAgICB0aGlzLnJlcUVudGVyQXJlYSgpO1xyXG4gICAgfSxcclxuICAgIFJvb3ROb2RlSGlkZSgpe1xyXG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFdmVudCgpO1xyXG4gICAgfSxcclxuICAgIG9uR2FtZUNvbmZpZyhtc2cpIHtcclxuICAgICAgICB0aGlzLmdhbWVDb25maWcgPSBtc2c7XHJcbiAgICAgICAgdGhpcy5pbml0VUkoKTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICByZXFFbnRlckFyZWEoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lSUQgPSBnbEdhbWUuc2NlbmV0YWcuRERaO1xyXG4gICAgICAgIGdsR2FtZS5yZWFkeXJvb20ucmVxRW50ZXJBcmVhKGdsR2FtZS5zY2VuZXRhZy5ERFopO1xyXG4gICAgfSxcclxuICAgIGdvbGRPbmxpbmVOdW0obXNnKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLov5nmmK/lnKjnur/kurrmlbDnmoTmtojmga9cIiwgbXNnKVxyXG4gICAgICAgIGxldCBjb3VudCA9IHRoaXMubGV2ZWwubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobXNnW2kgKyAxXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZXZlbFtpXS5nZXRDaGlsZEJ5TmFtZShcInBlb3BsZV9udW1cIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBtc2dbaSArIDFdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW5pdFVJKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGxldCBjb25maWd1cmUgPSB0aGlzLmdhbWVDb25maWc7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gdGhpcy5sZXZlbC5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGV2ZWxbaV0uZ2V0Q2hpbGRCeU5hbWUoXCJkaXpodWxhb3V0XCIpLmdldENoaWxkQnlOYW1lKFwiZGl6aHVfbnVtXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGhpcy5jdXRGbG9hdChjb25maWd1cmVbaV0uQmFzZUNoaXBzKTtcclxuICAgICAgICAgICAgdGhpcy5sZXZlbFtpXS5nZXRDaGlsZEJ5TmFtZShcInpodW5ydWxheW91dFwiKS5nZXRDaGlsZEJ5TmFtZShcInpodW5ydV9udW1cIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLmN1dEZsb2F0KGNvbmZpZ3VyZVtpXS5FbnRyYW5jZVJlc3RyaWN0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGN1dEZsb2F0KHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIChOdW1iZXIodmFsdWUpLmRpdigxMDApKS50b1N0cmluZygpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog5qOA5p+l546p5a626YeR5biB5piv5ZCm6Laz5aSfXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgY2hlY2tHb2xkKGNvaW4sIG1pbkNpb24pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIumHkeW4geajgOa1i1wiLCBjb2luLCBtaW5DaW9uKTtcclxuICAgICAgICBpZiAocGFyc2VJbnQoY29pbikgPCBwYXJzZUludChtaW5DaW9uKSkge1xyXG4gICAgICAgICAgICBnbEdhbWUucGFuZWwuc2hvd0RpYWxvZyhnbEdhbWUuaTE4bi50KFwiVVNFUi5HT0xETEFDSy5USVRMRVwiKSwgZ2xHYW1lLmkxOG4udChcIlVTRVIuR09MRExBQ0suQ09OVEVOVFwiKSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2xHYW1lLnBhbmVsLnNob3dQYW5lbEJ5TmFtZShcInNob3BcIik7XHJcbiAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIHNob3dVc2VySW5mbygpIHtcclxuICAgICAgICBnbEdhbWUucGFuZWwuc2hvd1JlbW90ZUltYWdlKHRoaXMuUGxheWVyaGVhZCwgZ2xHYW1lLnVzZXIuZ2V0KFwiaGVhZFVSTFwiKSk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRldXNlckluZm8oKSB7XHJcbiAgICAgICAgbGV0IGNvaW4gPSBnbEdhbWUudXNlci5nZXQoXCJjb2luXCIpXHJcbiAgICAgICAgdGhpcy5nb2xkQ291bnQuc3RyaW5nID0gZ2xHYW1lLnVzZXIuR29sZFRlbXAoY29pbik7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEdhbWVJZChnYW1laWQpIHtcclxuICAgICAgICB0aGlzLmdhbWVpZCA9IGdhbWVpZDtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlQmdJbmZvKCkge1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIGNsaWNrX3VzZXJpbmZvKCkge1xyXG4gICAgICAgIGdsR2FtZS5wYW5lbC5zaG93UGFuZWxCeU5hbWUoXCJ1c2VyaW5mb1wiKTtcclxuICAgIH0sXHJcbiAgICBjbGlja19hZGRnb2xkKCkge1xyXG4gICAgICAgIGdsR2FtZS5wYW5lbC5zaG93U2hvcCgzMCk7XHJcbiAgICB9LFxyXG4gICAgY2xpY2tfYmFjaygpIHtcclxuICAgICAgICBnbEdhbWUucmVhZHlyb29tLnJlcUV4aXRBcmVhKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgIH0sXHJcbiAgICBjbGlja19oZWxwKCkge1xyXG4gICAgICAgIGxldCBwYW5lbCA9IGdsR2FtZS5wYW5lbC5zaG93UGFuZWwodGhpcy5ydWxlUHJlZmFiKTtcclxuICAgICAgICBwYW5lbC56SW5kZXggPSAzMDtcclxuICAgIH0sXHJcbiAgICBjbGlja19yZWNvcmQoKSB7XHJcbiAgICAgICAgbGV0IHBhbmVsID0gZ2xHYW1lLnBhbmVsLnNob3dQYW5lbCh0aGlzLnJlY29yZFByZWZhYik7XHJcbiAgICAgICAgcGFuZWwuekluZGV4ID0gMzA7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgZ2V0KGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW2tleV07XHJcbiAgICB9LFxyXG4gICAgT25EZXN0cm95KCkge1xyXG4gICAgICAgIGdsR2FtZS5lbWl0dGVyLm9mZihNRVNTQUdFLlVJLlJPT01fRU5URVJfU0hPVyx0aGlzKTtcclxuICAgICAgICBnbEdhbWUuZW1pdHRlci5vZmYoTUVTU0FHRS5VSS5ST09NX0VOVEVSX0hJREUsdGhpcyk7XHJcbiAgICAgICAgZ2xHYW1lLmVtaXR0ZXIub2ZmKFwibm9kZVJlbW92ZVwiLCB0aGlzKTtcclxuICAgICAgICBnbEdhbWUuZW1pdHRlci5vZmYoXCJ1cGRhdGVVc2VyRGF0YVwiLHRoaXMpO1xyXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckV2ZW50KCk7XHJcbiAgICB9LFxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbn0pO1xyXG4iXX0=