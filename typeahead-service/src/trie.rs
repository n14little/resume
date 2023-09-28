use std::collections::{HashMap, VecDeque};

struct TrieNode {
    children: HashMap<char, TrieNode>,
    is_completed: bool,
}
trait TrieApi {
    fn init() -> TrieNode;
    fn insert(&mut self, new_word: VecDeque<char>) -> &mut TrieNode;
}

impl TrieApi for TrieNode {
    fn init() -> TrieNode {
        let new_node = TrieNode {
            children: HashMap::new(),
            is_completed: false,
        };
        new_node
    }
    fn insert(&mut self, mut new_word: VecDeque<char>) -> &mut TrieNode {
        match new_word.pop_front() {
            Some(c) => {
                let entry = self.children.entry(c).or_insert(TrieNode::init());
                if new_word.is_empty() {
                    entry.is_completed = true;
                    entry
                } else {
                    entry.insert(new_word)
                }
            }
            None => {
                self.is_completed = true;
                self
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn init_works() {
        let root_node = TrieNode::init();
        assert_eq!(root_node.is_completed, false);
        assert_eq!(root_node.children.len(), 0)
    }

    #[test]
    fn insert_single_character() {
        let mut root_node = TrieNode::init();
        root_node.insert(VecDeque::from(['a']));

        assert_eq!(root_node.children.len(), 1);

        let new_leaf = root_node.children.get_mut(&'a').unwrap();
        assert_eq!(new_leaf.is_completed, true);
        assert_eq!(new_leaf.children.len(), 0);
    }

    #[test]
    fn insert_many_characters() {
        let mut root_node = TrieNode::init();
        root_node.insert(VecDeque::from(['a', 'b', 'c']));

        assert_eq!(root_node.children.len(), 1);

        let a_node = root_node.children.get_mut(&'a').unwrap();
        assert_eq!(a_node.is_completed, false);
        assert_eq!(a_node.children.len(), 1);

        let b_node = a_node.children.get_mut(&'b').unwrap();
        assert_eq!(b_node.is_completed, false);
        assert_eq!(b_node.children.len(), 1);

        let c_node = b_node.children.get_mut(&'c').unwrap();
        assert_eq!(c_node.is_completed, true);
        assert_eq!(c_node.children.len(), 0);
    }

    #[test]
    fn insert_many_words() {
        let mut root_node = TrieNode::init();
        root_node.insert(VecDeque::from(['c', 'a', 't']));
        root_node.insert(VecDeque::from(['c', 'a', 'r']));
        root_node.insert(VecDeque::from(['c', 'a', 'r', 't']));

        assert_eq!(root_node.children.len(), 1);

        let c_node = root_node.children.get_mut(&'c').unwrap();
        assert_eq!(c_node.is_completed, false);
        assert_eq!(c_node.children.len(), 1);

        let ca_node = c_node.children.get_mut(&'a').unwrap();
        assert_eq!(ca_node.is_completed, false);
        assert_eq!(ca_node.children.len(), 2);

        let car_node = ca_node.children.get_mut(&'r').unwrap();
        assert_eq!(car_node.is_completed, true);
        assert_eq!(car_node.children.len(), 1);

        let cat_node = ca_node.children.get_mut(&'t').unwrap();
        assert_eq!(cat_node.is_completed, true);
        assert_eq!(cat_node.children.len(), 1);

        let cart_node = car_node.children.get_mut(&'t').unwrap();
        assert_eq!(cart_node.is_completed, true);
        assert_eq!(cart_node.children.len(), 1);
    }
}
