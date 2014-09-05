import argparse
import collections
import json
import shutil
import os


def main():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument('input_dump', type=argparse.FileType('r'))
    arg_parser.add_argument('output_dir')

    args = arg_parser.parse_args()

    if not os.path.isdir(args.output_dir):
        raise Exception('output_dir is not a directory')

    user_pool = collections.defaultdict(
            lambda: collections.defaultdict(
                lambda: collections.defaultdict(list))
        )
    flv_pool = collections.defaultdict(lambda: collections.defaultdict(dict))

    for line in args.input_dump:
        doc = json.loads(line)

        if not doc.get('item_added_to_tracker'):
            continue

        user = doc['user'].lower()
        video_id = doc['video_id']

        user_pool[user[0:1]][user[0:2]][user].append(video_id)
        user_pool[user[0:1]][user[0:2]][user] = list(sorted(user_pool[user[0:1]][user[0:2]][user]))

        flv_urls = []
        flv_doc = doc['flv']
        flv_keys = tuple(sorted(int(key) for key in flv_doc.keys()))

        for key in flv_keys:
            url = flv_doc[str(key)]
            flv_urls.append(url)

        flv_pool[video_id[0:2]][video_id[0:3]][video_id] = flv_urls


    for key, subpool in user_pool.items():
        for subkey, subsubpool in subpool.items():
            path = 'channel/{0}/data-{1}.json'.format(key, subkey)
            path = os.path.join(args.output_dir, path)
            dir_path = os.path.dirname(path)

            if not os.path.exists(dir_path):
                os.makedirs(dir_path)

            with open(path, 'w') as out_file:
                json.dump(subsubpool, out_file, indent=2)

    for key, subpool in flv_pool.items():
        for subkey, subsubpool in subpool.items():
            path = 'video/{0}/data-{1}.json'.format(key, subkey)
            path = os.path.join(args.output_dir, path)
            dir_path = os.path.dirname(path)

            if not os.path.exists(dir_path):
                os.makedirs(dir_path)

            with open(path, 'w') as out_file:
                json.dump(subsubpool, out_file, indent=2)


if __name__ == '__main__':
    main()
