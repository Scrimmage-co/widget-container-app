import React, {useMemo} from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import InlineSelect from '../../components/InlineSelect';
import {Button, Switch, Text} from '@rneui/themed';
import BadgeCloud from '../../components/BadgeCloud';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import Scrimmage, {BetOutcome, Bet, SingleBet} from 'scrimmage-rewards';
import {SingleBetType} from 'scrimmage-rewards/dist/types/Rewardables';
import {RewarderKey} from '../../store/features/appConfigSlice';
import Toast from 'react-native-toast-message';

const SPORTS: string[] = ['Football', 'Basketball', 'Baseball'];

const LEAGUES: Record<string, string[]> = {
  Football: ['NFL', 'CFL', 'NCAA'],
  Basketball: ['NBA', 'WNBA', 'NCAA'],
  Baseball: ['MLB', 'KBO', 'NPB'],
};

const TEAMS: Record<string, string[]> = {
  NFL: ['Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens'],
  NCAA: [
    'Alabama Crimson Tide',
    'Appalachian State Mountaineers',
    'Arizona State Sun Devils',
  ],
  CFL: ['BC Lions', 'Calgary Stampeders', 'Edmonton Eskimos'],
  NBA: ['Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets'],
  WNBA: ['Atlanta Dream', 'Chicago Sky', 'Connecticut Sun'],
  MLB: ['Arizona Diamondbacks', 'Atlanta Braves', 'Baltimore Orioles'],
  KBO: ['Doosan Bears', 'Hanwha Eagles', 'Kia Tigers'],
  NPB: ['Hanshin Tigers', 'Hiroshima Toyo Carp', 'Yomiuri Giants'],
};

const PLAYERS: Record<string, string[]> = {
  'Arizona Cardinals': ['Kyler Murray', 'Chase Edmonds', 'James Conner'],
  'Atlanta Falcons': ['Matt Ryan', 'Mike Davis', 'Cordarrelle Patterson'],
  'Baltimore Ravens': ['Lamar Jackson', "Ty'Son Williams", 'Latavius Murray'],
  'Alabama Crimson Tide': [
    'Bryce Young',
    'Brian Robinson Jr.',
    'Jase McClellan',
  ],
  'Appalachian State Mountaineers': [
    'Chase Brice',
    'Cameron Peoples',
    'Daetrich Harrington',
  ],
  'Arizona State Sun Devils': [
    'Jayden Daniels',
    'Rachaad White',
    'DeaMonte Trayanum',
  ],
  'BC Lions': ['Michael Reilly', 'James Butler', 'Shaun Wick'],
  'Calgary Stampeders': [
    'Bo Levi Mitchell',
    'KaDeem Carey',
    'Ante Milanovic-Litre',
  ],
  'Edmonton Eskimos': ['Trevor Harris', 'James Wilder Jr.', 'Shaun Wick'],
  'Atlanta Hawks': ['Trae Young', 'John Collins', 'Bogdan Bogdanovic'],
  'Boston Celtics': ['Jayson Tatum', 'Jaylen Brown', 'Marcus Smart'],
  'Brooklyn Nets': ['Kevin Durant', 'James Harden', 'Kyrie Irving'],
  'Atlanta Dream': ['Courtney Williams', 'Odyssey Sims', 'Crystal Bradford'],
  'Chicago Sky': ['Candace Parker', 'Kahleah Copper', 'Allie Quigley'],
  'Connecticut Sun': ['Jonquel Jones', 'DeWanna Bonner', 'Brionna Jones'],
  'Arizona Diamondbacks': ['Ketel Marte', 'Josh Rojas', 'David Peralta'],
  'Atlanta Braves': ['Freddie Freeman', 'Ozzie Albies', 'Austin Riley'],
  'Baltimore Orioles': ['Cedric Mullins', 'Ryan Mountcastle', 'Austin Hays'],
  'Doosan Bears': ['Jose Miguel Fernandez', 'Jae-il Oh', 'Joo-hwan Choi'],
  'Hanwha Eagles': ['Jung-hoo Lee', 'Jin-haeng Choi', 'Jin-ho Jung'],
  'Kia Tigers': ['Preston Tucker', 'Hyoung-woo Choi', 'Ji-wan Na'],
  'Hanshin Tigers': ['Yusuke Oyama', 'Koji Chikamoto', 'Kento Itohara'],
  'Hiroshima Toyo Carp': [
    'Ryosuke Kikuchi',
    'Seiya Suzuki',
    'Ryuhei Matsuyama',
  ],
  'Yomiuri Giants': ['Hayato Sakamoto', 'Kazuma Okamoto', 'Zelous Wheeler'],
};

const BET_TYPES: Array<string> = [
  'over',
  'under',
  'spread',
  'moneyline',
  'prop',
];

const DECIMAL_ODDS: Array<number> = [
  1.12, 1.27, 1.44, 1.47, 1.59, 1.84, 2.03, 2.16, 2.2, 2.34, 2.44, 2.56, 2.58,
  2.7, 2.87, 2.97, 3.05, 3.4, 3.6, 3.76,
];

const PARLEY_LEGS: Array<number> = [2, 3, 4, 5];

const WAGER_AMOUNTS: Array<number> = [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500];

const OUTCOMES: Array<string> = ['win', 'lose', 'push', 'cashout', 'postponed'];

interface FormValues {
  integration: string;
  sport: string;
  league: string;
  teamBetOn: string;
  teamBetAgainst: string;
  player: string;
  betType: SingleBetType;
  odds: number;
  parlayLegs: number;
  wagerAmount: number;
  outcome: BetOutcome;
  isLive: boolean;
}

const BetConfigScreen = () => {
  const privateAliases = useSelector<RootState, RewarderKey[]>(
    state => state.appConfig.privateKeys,
  )?.map(key => key.name);
  const userId = useSelector<RootState, string>(
    state => state.appConfig.userId,
  );
  const {control, handleSubmit, watch, formState} = useForm<FormValues>({
    defaultValues: {
      integration: privateAliases[0],
      sport: '',
      league: '',
      teamBetOn: '',
      teamBetAgainst: '',
      player: '',
      betType: null,
      odds: 1,
      parlayLegs: 1,
      wagerAmount: 0,
      outcome: null,
      isLive: false,
    },
  });

  const selectedSport = watch('sport');
  const selectedLeague = watch('league');
  const selectedTeamOn = watch('teamBetOn');
  const selectedTeamAgainst = watch('teamBetAgainst');
  const wagerAmount = watch('wagerAmount');
  const odds = watch('odds');
  const outcome = watch('outcome');
  const netProfit = useMemo(() => {
    if (outcome === 'win' && wagerAmount && odds) {
      return Math.round(wagerAmount * (odds - 1) * 100) / 100;
    }
    return 0;
  }, [wagerAmount, odds, outcome]);

  const description = useMemo(() => {
    return `[${selectedLeague}] ${selectedTeamOn} vs ${selectedTeamAgainst} +${odds} +${
      wagerAmount + netProfit
    }$`;
  }, [
    selectedLeague,
    selectedTeamOn,
    selectedTeamAgainst,
    odds,
    wagerAmount,
    netProfit,
  ]);

  const onSubmit = async (data: FormValues) => {
    const bets: SingleBet[] = [];
    for (let i = 0; i < data.parlayLegs; i++) {
      bets.push({
        sport: data.sport,
        league: data.league,
        teamBetOn: data.teamBetOn,
        teamBetAgainst: data.teamBetAgainst,
        player: data.player,
        odds: data.odds,
        type: data.betType,
      });
    }
    const rewardable: Bet = {
      id: `coinflip_${(Math.random() * 1000000000000000000).toString()}`,
      userId: userId,
      type: 'bet',
      betType: data.parlayLegs > 1 ? 'parlays' : 'single',
      odds: data.odds,
      description,
      wagerAmount: data.wagerAmount,
      netProfit,
      outcome: data.outcome,
      betDate: Date.now(),
      bets,
    };
    try {
      await Scrimmage.reward.trackRewardable('coinflip', rewardable);
      Toast.show({
        text1: 'Bet tracked!',
        text2: 'Your bet has been tracked successfully.',
      });
    } catch (e) {
      Toast.show({
        text1: 'Error',
        text2: (e as any)?.message,
      });
    }
  };

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <ScrollView>
        <Controller
          name="integration"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.integration && styles.errorText}>
                Integration
              </Text>
              <InlineSelect
                selected={value}
                onSelect={onChange}
                items={privateAliases.map(alias => ({
                  label: alias,
                  value: alias,
                }))}
              />
            </View>
          )}
        />
        <Controller
          name="betType"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.betType && styles.errorText}>
                Bet Type
              </Text>
              <InlineSelect
                selected={value}
                onSelect={onChange}
                items={BET_TYPES.map(betType => ({
                  label: betType,
                  value: betType,
                }))}
              />
            </View>
          )}
        />
        <Controller
          name="sport"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.sport && styles.errorText}>
                Sport
              </Text>
              <InlineSelect
                selected={value}
                onSelect={event => {
                  onChange(event);
                }}
                items={SPORTS.map(sport => ({
                  label: sport,
                  value: sport,
                }))}
              />
            </View>
          )}
        />
        {Boolean(selectedSport) && (
          <Controller
            name="league"
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}, formState: {errors}}) => (
              <View>
                <Text h4 style={errors.league && styles.errorText}>
                  League
                </Text>
                <InlineSelect
                  selected={value}
                  onSelect={league => {
                    onChange(league);
                  }}
                  items={LEAGUES[selectedSport].map(league => ({
                    label: league,
                    value: league,
                  }))}
                />
              </View>
            )}
          />
        )}
        {Boolean(selectedLeague) && (
          <View>
            <Text h4>Team On vs Team Against</Text>
            <View style={styles.teams}>
              <View style={styles.team}>
                {Boolean(selectedLeague) && (
                  <Controller
                    name="teamBetOn"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <View>
                        <InlineSelect
                          selected={value}
                          onSelect={team => {
                            onChange(team);
                          }}
                          items={TEAMS[selectedLeague].map(team => ({
                            label: team,
                            value: team,
                            disabled: team === watch('teamBetAgainst'),
                          }))}
                        />
                      </View>
                    )}
                  />
                )}
              </View>
              <Text h4>vs</Text>
              <View style={styles.team}>
                {Boolean(selectedLeague) && (
                  <Controller
                    name="teamBetAgainst"
                    control={control}
                    render={({field: {onChange, value}}) => (
                      <View>
                        <InlineSelect
                          selected={value}
                          onSelect={team => {
                            onChange(team);
                          }}
                          items={TEAMS[selectedLeague].map(team => ({
                            label: team,
                            value: team,
                            disabled: team === watch('teamBetOn'),
                          }))}
                        />
                      </View>
                    )}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        <View>
          {(Boolean(selectedTeamOn) || Boolean(selectedTeamAgainst)) && (
            <Controller
              name="player"
              control={control}
              render={({field: {onChange, value}}) => {
                const players = [
                  ...(PLAYERS[selectedTeamOn] || []),
                  ...(PLAYERS[selectedTeamAgainst] || []),
                ];
                return (
                  <View>
                    <Text h4>Player (optional)</Text>
                    <InlineSelect
                      canUnselect
                      selected={value}
                      onSelect={onChange}
                      items={players.map(player => ({
                        label: player,
                        value: player,
                      }))}
                    />
                  </View>
                );
              }}
            />
          )}
        </View>
        <Controller
          name="odds"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.odds && styles.errorText}>
                Odds
              </Text>
              <BadgeCloud
                selected={value?.toString()}
                onSelect={odd => onChange(parseFloat(odd) || 0)}
                items={DECIMAL_ODDS.map(oddsItem => oddsItem.toString())}
              />
            </View>
          )}
        />
        <Controller
          name="parlayLegs"
          control={control}
          render={({field: {onChange, value}}) => (
            <View>
              <Text h4>Parlay Legs</Text>
              <Text>Not selected = single bet</Text>
              <BadgeCloud
                canUnselect
                selected={value?.toString()}
                onSelect={parleyLegs => onChange(parseInt(parleyLegs, 10) || 1)}
                items={PARLEY_LEGS.map(leg => leg.toString())}
              />
            </View>
          )}
        />
        <Controller
          name="wagerAmount"
          control={control}
          rules={{
            required: true,
            min: {
              value: 1,
              message: 'Wager amount must be at least $1',
            },
          }}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.wagerAmount && styles.errorText}>
                Wager Amount
              </Text>
              <BadgeCloud
                selected={value?.toString()}
                onSelect={wager => onChange(parseFloat(wager))}
                items={WAGER_AMOUNTS.map(amount => amount.toString())}
              />
            </View>
          )}
        />
        <Controller
          name="isLive"
          control={control}
          render={({field: {onChange, value}}) => (
            <View>
              <Text h4>Is Live</Text>
              <Switch value={value} onValueChange={onChange} />
            </View>
          )}
        />
        <Controller
          name="outcome"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.outcome && styles.errorText}>
                Outcome
              </Text>
              <InlineSelect
                selected={value}
                onSelect={onChange}
                items={OUTCOMES.map(outcomeItem => ({
                  label: outcomeItem,
                  value: outcomeItem,
                }))}
              />
            </View>
          )}
        />
        <Text h4>Net Profit</Text>
        <Text>{netProfit}</Text>
        {Object.keys(formState.errors).length > 0 && (
          <Text style={styles.errorText}>Please fill out all fields</Text>
        )}
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </TabScreenSafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  team: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
});

export default BetConfigScreen;
