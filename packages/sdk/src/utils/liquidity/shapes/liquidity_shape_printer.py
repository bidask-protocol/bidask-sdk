from math import sqrt

# ОБЩИЕ ФУНКЦИИ ЛИКВЫ
##################################################################

def get_liquidity_x(x, sa, sb):
    return (x * sa * sb) / (sb - sa)

def get_liquidity_y(y, sa, sb):
    return y / (sb - sa)

def get_liquidity(x, y, sp, sa, sb):
    debug('get_liquidity', x, y, sp, sa, sb)

    if sp <= sa:
        return get_liquidity_x(x, sa, sb)
    elif sp < sb:
        return min(get_liquidity_x(x, sp, sb),
                    get_liquidity_y(y, sa, sp))
    else:
        return get_liquidity_y(y, sa, sb)

def calculate_x(L, sp, sa, sb):
    # debug(L, sa, sp, sb)
    return L * (sb - sp) / (sp * sb)

def calculate_y(L, sp, sa, sb):
    return L * (sp - sa)

# ФУНКЦИИ ДЛЯ ФОРМ
##################################################################

def get_price_bounds(bin, bin_step):
    basis = 1 + bin_step
    return (sqrt(basis**bin), sqrt(basis**(bin+1)))

def count_between(a, b):
    return abs(b - a) + 1

def arithmic_progression_sum(a, b):
    debug(f'progression from {a} to {b}')
    return (a + b) * count_between(a, b) / 2

def bidask_bin_height(bin, current_bin):
    return count_between(current_bin, bin)

def curve_bin_height(bin, farest_bin, current_bin):
    return count_between(farest_bin, current_bin) - abs(bin - current_bin)

def bidask_sum(from_bin, to_bin, current_bin):
    return arithmic_progression_sum(
        bidask_bin_height(from_bin, current_bin), bidask_bin_height(to_bin, current_bin)
    )

def curve_sum(from_bin, to_bin, current_bin):
    debug(f'curve sum from {from_bin} to {to_bin}')
    if abs(from_bin - current_bin) > abs(to_bin - current_bin):
        farest_bin = from_bin
    else:
        farest_bin = to_bin
    debug(f'{farest_bin=}')
    return arithmic_progression_sum(
        curve_bin_height(from_bin, farest_bin, current_bin),
        curve_bin_height(to_bin, farest_bin, current_bin)
    )

def get_height(shape, bin, current_bin, farest_bin):
    match shape:
        case 'spot':
            return 1
        case 'curve':
            return curve_bin_height(bin, farest_bin, current_bin)
        case 'bidask':
            return bidask_bin_height(bin, current_bin)

##################################################################

def debug(*x):
    print('🔴', *x)

def print_provision_array(x, y, shape, from_bin, to_bin, ratio, cur_bin, sqrt_p, bin_step):
    assert(0 <= ratio <= 1)
    assert(from_bin <= to_bin)
    print(f'>>>>> {shape.capitalize()} {x} X and {y} Y from {from_bin} to {to_bin}')
    amount = (y, x)

    pa, pb = get_price_bounds(cur_bin, bin_step)
    debug(f'{pa} - {sqrt_p} - {pb}')

    nearest_to_current = (min(to_bin, cur_bin - 1), max(cur_bin + 1, from_bin))
    debug('nearest', nearest_to_current)

    # считаем сумму долей
    match shape:
        case 'spot':
            units = (count_between(from_bin, nearest_to_current[0]), count_between(nearest_to_current[1], to_bin))
        case 'bidask':
            units = (bidask_sum(from_bin, nearest_to_current[0], cur_bin), bidask_sum(nearest_to_current[1], to_bin, cur_bin))
        case 'curve':
            units = (curve_sum(from_bin, nearest_to_current[0], cur_bin), curve_sum(nearest_to_current[1], to_bin, cur_bin))
    debug('units', units)

    two_sided = from_bin <= cur_bin <= to_bin
    if two_sided:
        single_L = get_liquidity(1, 1, sqrt_p, pa, pb)
        debug('single_L:', single_L)
        share = (calculate_y(single_L, sqrt_p, pa, pb), calculate_x(single_L, sqrt_p, pa, pb))
        debug('share:', share)
        per_unit = [amount[i] / (units[i] + share[i]) for i in (0, 1)]
        debug('per_unit:', per_unit)
        curve_magnitude = (count_between(from_bin, cur_bin), count_between(cur_bin, to_bin))
        in_cur_bin_potential = [per_unit[i] * share[i] * (curve_magnitude[i] if shape == 'curve' else 1) for i in (0, 1)]
        debug(f'share absolute', in_cur_bin_potential)
        # узнаём, что нам выгоднее положить для маленького эксцесса, считаем ликвидность
        debug(x, y, ratio, in_cur_bin_potential[0], in_cur_bin_potential[1])
        debug(get_liquidity_y(in_cur_bin_potential[0], pa, pb), get_liquidity_x(in_cur_bin_potential[1], pa, pb))
        if get_liquidity_y(in_cur_bin_potential[0], pa, pb) > get_liquidity_x(in_cur_bin_potential[1], pa, pb): # если больший excess в y
            debug('y is bigger')
            L = get_liquidity(x * ratio + in_cur_bin_potential[1] * (1 - ratio), in_cur_bin_potential[0] * ratio + y * (1 - ratio), sqrt_p, pa, pb)
        else:
            debug('x is bigger')
            L = get_liquidity(x * (1 - ratio) + in_cur_bin_potential[1] * ratio, in_cur_bin_potential[0] * (1 - ratio) + y * ratio, sqrt_p, pa, pb)
        debug('L:', L)
        # считаем, сколько токенов ляжет в центральный бин
        debug(L, pa, pb, sqrt_p, calculate_y(L, sqrt_p, pa, pb), calculate_x(L, sqrt_p, pa, pb))
        in_cur_bin = (calculate_y(L, sqrt_p, pa, pb), calculate_x(L, sqrt_p, pa, pb))
    else:
        in_cur_bin = (0, 0)
    debug('in cur bin:', in_cur_bin)

    # считаем, сколько останется каждого
    rest = [amount[i] - in_cur_bin[i] for i in (0, 1)]
    debug('rest:', rest)

    # считаем удельное количество каждого токена
    per_unit = [0 if units[i] == 0 else rest[i] / units[i] for i in (0, 1)]
    debug('per unit:', per_unit)

    # считаем для каждого бина
    bins = []
    for bin in range(from_bin, to_bin + 1):
        if bin < cur_bin:
            bins.append([get_height(shape, bin, cur_bin, from_bin) * per_unit[0], 0])
        elif bin == cur_bin:
            bins.append(in_cur_bin)
        else:
            bins.append([0, get_height(shape, bin, cur_bin, to_bin) * per_unit[1]])

    for tokens in bins:
        print(tokens[1], tokens[0])

    # проверим сумму
    total_y = sum(i[0] for i in bins)
    total_x = sum(i[1] for i in bins)
    print(f'Дано: {x} X, залито: {total_x}')
    print(f'Дано: {y} Y, залито: {total_y}')
    assert(total_y - 0.00000000001 <= y)
    assert(total_x - 0.00000000001 <= x)
    return bins, (total_x, total_y)

# ПАРАМЕТРЫ
##################################################################

# актуальные бин и цена
# cur_bin = 46
# sqrt_p = 1.4142135623730951

##################################################################
# ТЕСТЫ
##################################################################

# print_provision_array(1000000000, 1000000000, 'curve', 219, 247, 1, 232, sqrt(10.0852), 0.01)
# print_provision_array(1000000000, 2000000000, 'bidask', 232, 242, 1, 232, sqrt(10.0852), 0.01)
# print_provision_array(1 * 10 ** 6, 10 * 10 ** 9, 'curve', 455, 469, 0.8, 462, sqrt(100), 0.01)
print_provision_array(1000000000, 2000000000, 'curve', 227, 232, 1, 232, sqrt(10.0852), 0.01)