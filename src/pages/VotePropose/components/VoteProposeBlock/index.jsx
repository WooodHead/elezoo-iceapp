import React, { useState, useEffect } from 'react';
import { useRequest, useParams, store, useHistory } from 'ice';
import {
  Button,
  Card,
  Form,
  ResponsiveGrid,
  Avatar,
  Upload,
  Divider,
  Input,
  Message,
  Loading,
  Tag,
  Icon,
  Grid,
  MenuButton,
} from '@alifd/next';
import VoteInfo from '@/components/VoteInfo';
import voteDetailService from '@/services/voteDetail';
import styles from './index.module.scss';
import vote from '@/pages/Vote/services/vote';

const { Cell } = ResponsiveGrid;
const { Row, Col } = Grid;
const periodLabels = {
  notStarted: '未开始',
  proposing: '提议中',
  voting: '投票中',
  end: '已结束',
};
const periodColors = {
  notStarted: 'blue',
  proposing: 'green',
  voting: 'orange',
  end: '#E2E4E8',
};
const privacyLabels = {
  realName: '实名',
  free: '自由',
  anonymity: '匿名',
};

const VoteProposeBlock = () => {
  const { id } = useParams();
  const history = useHistory();
  const [newProposal, setProposal] = useState('');
  const [userState, userDispatchers] = store.useModel('user');
  const [voteState, voteDispatchers] = store.useModel('voteDetail');
  const { data, loading, request } = useRequest(voteDetailService.getVote, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.fetchVote(result);
      if (result.period !== 'proposing')
        history.push(`/vote/${result.period}/${result._id}`);
      // Message.success('加载成功');
    },
    onError: () => {
      Message.error('加载失败');
    },
  });

  const { loading: nextLoading, request: nextRequest } = useRequest(
    voteDetailService.nextPeriod,
    {
      onSuccess: async (result) => {
        console.log(result);
        history.push(`/vote/voting/${id}`);
        Message.success('成功进入投票');
      },
      onError: (err) => {
        err.response
          ? Message.error(err.response.data.message)
          : Message.error('进入投票失败');
      },
    }
  );

  const {
    data: proposeData,
    loading: proposeLoading,
    request: proposeRequest,
  } = useRequest(voteDetailService.propose, {
    onSuccess: async (result) => {
      console.log(result);
      await voteDispatchers.addProposal(result);
      setProposal('');
      // console.log(voteState);
      Message.success('添加成功');
    },
    onError: (err) => {
      err.response
        ? Message.error(err.response.data.message)
        : Message.error('添加失败');
    },
  });

  useEffect(() => {
    request(id);
  }, []);

  const onNewChange = (value) => {
    console.log('change:', value);
    setProposal(value);
  };

  const onSubmit = () => {
    console.log('jsut submit', newProposal);
    console.log(voteState.privacyOption);
    if (!newProposal) {
      Message.error('请填写提议');
      return;
    }
    proposeRequest(id, {
      content: newProposal,
      privacy: voteState.privacyOption,
    });
  };

  const onItemSubmit = (privacyOption) => {
    console.log(newProposal);
    console.log(privacyOption);
    if (!newProposal) {
      Message.error('请填写提议');
      return;
    }
    proposeRequest(id, { content: newProposal, privacy: privacyOption });
  };

  return (
    <Card free>
      <Card.Content className={styles.votePageBlock}>
        <Loading visible={loading}>
          <VoteInfo voteState={voteState} />
          <div className={styles.middleBlock} />
          <div>
            {voteState.proposals.map((proposal) => {
              return (
                <div key={proposal._id}>
                  <div className={styles.item}>
                    <div className={styles.itemLeft}>
                      <div className={styles.index}>{proposal.idx}. </div>
                      <div className={styles.content}>{proposal.content}</div>
                    </div>
                    <div className={styles.itemRight}>
                      <Avatar
                        className={styles.proposer}
                        src={proposal.proposerInfo.avatar}
                      />
                      <Icon className={styles.delete} type="close" size="xs" />
                    </div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                </div>
              );
            })}
            <div className={styles.addItem}>
              <Input
                type="secondary"
                className={styles.input}
                value={newProposal}
                onChange={onNewChange}
              />
              {voteState.privacyOption === 'free' ? (
                <MenuButton
                  label="添加提议"
                  type="primary"
                  className={styles.btn}
                  loading={proposeLoading}
                  onItemClick={onItemSubmit}
                >
                  <MenuButton.Item key="realName">{'实名提交'}</MenuButton.Item>
                  <MenuButton.Item key="anonymity">
                    {'匿名提交'}
                  </MenuButton.Item>
                </MenuButton>
              ) : (
                <Button
                  type="primary"
                  className={styles.btn}
                  loading={proposeLoading}
                  onClick={onSubmit}
                >
                  添加提议
                </Button>
              )}
            </div>
          </div>
          {voteState.owner && voteState.owner === userState._id ? (
            <div>
              <div className={styles.middleBlock} />
              <Button
                type="secondary"
                loading={nextLoading}
                style={{ display: 'block', margin: '0 auto' }}
                onClick={() => {
                  nextRequest(id, 'voting');
                }}
              >
                开始投票
              </Button>
            </div>
          ) : (
            ''
          )}
        </Loading>
      </Card.Content>
    </Card>
  );
};

export default VoteProposeBlock;