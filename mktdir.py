import sys
import os
import hashlib

def main(file_path):
    for new_path_ls in read_paths(file_path):
        new_path = os.path.join(*new_path_ls)
        if (os.path.basename(new_path) == '!'):
            create_hash(os.path.dirname(new_path))
        elif (os.path.basename(new_path).endswith('!')):
            real_dir_path = new_path[0:-1]
            create_dir(real_dir_path)
            create_hash(real_dir_path)
        else:
            create_dir(new_path)


def create_hash(dir_path):
    file_path = os.path.join(dir_path, 'index.json')
    print('about the create hash {}... '.format(file_path), end='')
    if not os.path.exists(file_path):
        path_hash = hashlib.md5(dir_path.encode('ascii')).hexdigest()
        path_hash_string = '\t"test-me": "{}"'.format(path_hash)

        with open(file_path, mode='w+') as file:
            file.write('\n'.join(['{', path_hash_string, '}']))

        print('OK')
    else:
        print('SKIP')


def create_dir(dir_path):
    print('about the create directory {}... '.format(dir_path), end='')
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        print('OK')
    else:
        print('SKIP')


def read_paths(file_path):
    base_path = os.path.dirname(file_path)

    lines = ['']
    with open(file_path, mode='r') as f:
        s_lines = f.readlines()
        lines = [line.rstrip() for line in s_lines]

    lines.reverse()
    leashes = [(base_path, -1)]
    result = []
    while lines:
        line_raw: str = lines.pop()
        if len(line_raw.strip()) == 0:
            continue

        depth = len(line_raw) - len(line_raw.lstrip())
        current = line_raw.strip()

        while leashes and depth <= leashes[-1][1]:
            leashes.pop()

        result.append([p for p, d in leashes] + [current])
        leashes.append((current, depth))

    return result


main(sys.argv[1])
