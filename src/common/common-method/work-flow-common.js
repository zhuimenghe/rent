import * as urlConstant from "../../network/url-constant.js";
import * as savekey from "./save-key.js";
import network from "../../network/index.js";
//获取第一个节点是否设置的审批人
const getFirstNodeUser = function (
  urlapi,
  processKey,
  orgId,
  businessOwner,
  condition
) {
  return new Promise((resolve, reject) => {
    let urlstr = urlConstant.FIRST_NODE_USER.replace(/xxx/, urlapi);
    let param = {
      processKey: processKey,
      businessOwner: businessOwner,
    };
    if (condition) {
      param = {
        ...param,
        conditionKey: "logisticsType",
        conditionValue: condition,
      };
    }
    if (orgId) {
      param = {
        ...param,
        orgId: orgId,
      };
    }
    console.log("param:" + JSON.stringify(param));
    network
      .getData(urlstr, "GET", param)
      .then((result) => {
        let isShowAssignView = result.length <= 0;
        console.log(isShowAssignView,'isShowAssignView');
        resolve(isShowAssignView);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//根据审批人获取提交接口的返回
const submitData = function (isShowAssignView, alist) {
  let queryStr = "?wf=true";
  if (isShowAssignView) {
    let ids = [];
    alist.forEach((o) => {
      ids.push(o.id);
    });
    let idStr = ids.join(",");
    queryStr += "&assignees=" + idStr;
    return queryStr;
  } else {
    return queryStr;
  }
};
//通过请求
const getPassNodeUser = function (urlapi, procInstId, orgId, businessOwner) {
  return new Promise((resolve, reject) => {
    let urlstr = urlConstant.NEXT_NODE_USER.replace(/xxx/, urlapi);
    let param = {
      procInstId: procInstId,
      businessOwner: businessOwner,
    };
    if (orgId) {
      param = {
        ...param,
        orgId: orgId,
      };
    }
    network
      .getData(urlstr, "GET", param)
      .then((result) => {
        let isNeedAssign = !result || result.length <= 0;
        resolve(isNeedAssign);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const passapply = function (
  urlapi,
  ids,
  passInput,
  jsonStr,
  procDefId,
  procInstId,
  id
) {
  return new Promise((resolve, reject) => {
    let param = {
      assignees: ids,
      comment: passInput,
      json: jsonStr,
      procDefId: procDefId,
      procInstId: procInstId,
      taskId: id,
    };
    console.log(JSON.stringify(param));
    let urlstr = urlConstant.PASS_TASK.replace(/xxx/, urlapi);
    network
      .getData(urlstr, "POST", param)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//驳回环节列表
const getBackNode = function (urlapi, idstr, firstNode) {
  console.log(JSON.stringify(firstNode));
  return new Promise((resolve, reject) => {
    let url = urlConstant.BACK_LIST + idstr;
    let urlstr = url.replace(/xxx/, urlapi);
    network
      .getData(urlstr, "GET", null)
      .then((result) => {
        let selectList = result.map((o) => {
          return {
            ...o,
            value: o.id,
            label: o.name,
          };
        });
        let arr = [];
        if (firstNode && selectList) {
          arr = selectList.filter((o) => o.key === firstNode.id);
        }
        resolve(arr);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * 获取第一个节点是否设置的审批人
 */

const getProcessNode = function (urlapi, procDefId) {
  console.log(procDefId);
  return new Promise((resolve, reject) => {
    let urlstr = urlConstant.PROCESS_NODE.replace(/xxx/, urlapi);
    let param = {
      id: procDefId,
    };
    network
      .getData(urlstr, "GET", param)
      .then((result) => {
        let list = result;
        if (list) {
          let startNode = list.find((o) => o.type === 0);
          console.log(JSON.stringify(startNode));
          if (startNode) {
            let line = list.find((o) => o.source === startNode.id);
            let firstNode = list.find((o) => o.id === line.target);
            console.log(JSON.stringify(firstNode));
            resolve(firstNode);
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//驳回请求
const backTask = function (
  urlapi,
  backTaskId,
  backInput,
  id,
  procInstId,
  json
) {
  return new Promise((resolve, reject) => {
    let param = {
      backTaskId: backTaskId, //回退环节id
      comment: backInput,
      id: id,
      procInstId: procInstId,
    };
    if (json) {
      param = {
        ...param,
        json: json,
      };
    }
    let urlstr = urlConstant.BACK_TASK.replace(/xxx/, urlapi);
    network
      .getData(urlstr, "POST", param)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//获取busikey | json
const getdetailJson = function (urlapi, key) {
  return new Promise((resolve, reject) => {
    let url = urlConstant.DATA_FORM + key;
    let urlstr = url.replace(/xxx/, urlapi);
    network
      .getData(urlstr, "GET", null)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const iswf = function (wfValid) {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: savekey.USER_INFO_MEG,
      success: (res) => {
        let dict = res.data;
        let lesseeInfo = dict["lesseeInfo"];
        let iswfValid = lesseeInfo.wfValid;
        if (iswfValid === true || wfValid) {
          let businesses = lesseeInfo.businesses;
          let newbusinesses = businesses.filter((o) => {
            return o.modelKey === wfValid;
          });
          if (newbusinesses.length > 0) {
            let wfValiditem = newbusinesses[0].wfValid;
            console.log(wfValiditem);
            if (wfValiditem === true) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      },
      fail: (error) => {
        resolve(false);
      },
    });
  });
};
//关于工作流的流程列表获取
const getOnlineList = function (busnesskey) {
  return new Promise((resolve, reject) => {
    let param = {
      businessKey: busnesskey,
    };
    let url = urlConstant.HISTORIC_FLOW_LIST.replace(/xxx/, "contractapi");
    network
      .getData(url, "GET", param)
      .then((result) => {
        let list = deallist(result);
        resolve(list);
      })
      .catch((err) => {
        resolve([]);
      });
  });
};
const deallist = function (result) {
  let list = [];
  if (result) {
    let startid = result[0].key;
    result.forEach((o) => {
      if (o.key === startid) {
        list = [];
        list.push(o);
      } else {
        list.push(o);
      }
    });
  }
  return list;
};
//处理最新
const getApplyAllProcessNode = function (key) {
  return new Promise((resolve, reject) => {
    let urlstr = urlConstant.PROCESS_NODE.replace(/xxx/, "contractapi");
    let param = {
      key: key,
    };
    network
      .getData(urlstr, "GET", param)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve([]);
      });
  });
};
const getApplyProcessNode = function (key) {
  return new Promise((resolve, reject) => {
    let urlstr = urlConstant.PROCESS_NODE.replace(/xxx/, "contractapi");
    let param = {
      key: key,
    };
    network
      .getData(urlstr, "GET", param)
      .then((result) => {
        console.log(result,'getApplyProcessNode');
        let list = dealApplylist(result);
        resolve(list);
      })
      .catch((err) => {
        resolve([]);
      });
  });
};
const dealApplylist = function (list) {
  let nodeList = [];
  if (list) {
    let startNode = list.find((o) => o.type === 0);
    if (startNode) {
      let line = list.find((o) => o.source === startNode.id);
      let firstNode = list.find((o) => o.id === line.target);
      nodeList.push(firstNode);
    }
  }
  return nodeList;
};
export default {
  getFirstNodeUser,
  submitData,
  //通过
  getPassNodeUser,
  passapply,
  //退回
  getBackNode,
  getProcessNode,
  backTask,
  //获取详情
  getdetailJson,
  iswf,
  //工作流
  getApplyProcessNode,
  getOnlineList,
  getApplyAllProcessNode,
};
